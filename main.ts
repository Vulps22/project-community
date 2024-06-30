import express, { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import connectDb from './config/mongoose'
import dotenv from 'dotenv'
import getToken from './config/jwt-token'
import jwt from 'jsonwebtoken';

import Handler from './src/interfaces/handler'

dotenv.config();

const app = express();
const port = 3000;

//connect to MongoDb
connectDb();


app.use(express.json());

// Middleware to dynamically load handlers
app.use((req: Request, res: Response) => {
    const { method, path: reqPath } = req;
    const handlerPath = `./src/api${reqPath}.ts`;

    try {
        const handler: Handler = require(path.resolve(handlerPath)).default;

        if (handler.httpMethod === method) {
            if (handler.requireAuth) {
                authCheck(req, res, () => handler.execute(req, res))
            }
            else {
                handler.execute(req, res);
            }
        } else {
            res.status(405).send('Method Not Allowed');
        }
    } catch (error) {
        console.error(`Error loading handler for ${reqPath}:`, error);
        res.status(404).send('Handler not found');
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const authCheck = (req: Request, res: Response, next: () => void) => {
    const JWT_SECRET = getToken();
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid Token' })
    }
}