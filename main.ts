import express, { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import connectDb from './config/mongoose'
import dotenv from 'dotenv'
import getToken from './config/jwt-token'
import jwt from 'jsonwebtoken';

import Handler from './src/interfaces/handler'
import { Interaction } from './src/utility/interaction'
import HttpMethod from './src/enum/httpMethod';
import User from './src/models/user';

dotenv.config();

const app = express();
const port = 3000;

//connect to MongoDb
connectDb();


app.use(express.json());

// Middleware to dynamically load handlers
app.use((req: Request, res: Response) => {    
    const method = req.method as HttpMethod;
    const { path: reqPath } = req;

    const interaction: Interaction = new Interaction(req, res, method, path)


    const handlerPath = `./src/api${reqPath}.ts`;

    try {
        const handler: Handler = require(path.resolve(handlerPath)).default;

        if (handler.httpMethod === method) {
            if (handler.requireAuth) {
                authCheck(interaction, () => handler.execute(interaction))
            }
            else {
                handler.execute(interaction);
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

const authCheck = async (interaction: Interaction, next: NextFunction) => {
    const { req, res } = interaction;
    const JWT_SECRET = getToken();
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
        const user = await User.findById((decoded as any).id);

        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        interaction.user = user;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid Token' })
    }
}