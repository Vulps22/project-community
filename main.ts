import express, { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import connectDb from './config/mongoose'
import dotenv from 'dotenv'
import getToken from './config/jwt-token'
import jwt from 'jsonwebtoken';
import http from 'http';
import fs from 'fs';
import { Server } from 'socket.io';


import Handler from './src/handlers/handler'
import { Interaction } from './src/utility/interaction'
import HttpMethod from './src/enum/httpMethod';
import User from './src/models/user';

dotenv.config();

const app = express();
const port = 3000;

//connect to MongoDb
connectDb();


app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Be more specific in production!
        methods: ["GET", "POST"]
    }
});

// Dynamic import of event handlers
const eventHandlers: Array<any> = [];
const eventsPath = path.join(__dirname, 'src', 'event');

// Read directory and load event handlers
fs.readdirSync(eventsPath).forEach(file => {
    if (file.endsWith('.ts')) {
        console.log("Registering: ", file);
        const module = require(path.join(eventsPath, file)).default;
        if (module) {
            eventHandlers.push(module);
        }
    }
});


// Socket.io connection
io.on('connection', (socket) => {
    console.log("Connection detected");
    eventHandlers.forEach(HandlerClass => {
        new HandlerClass(io, socket); // Instantiate each event handler with the socket
    });
});

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
server.listen(port, () => {
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
        const user = await User.findById((decoded as any).id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        interaction.user = user;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid Token' })
    }
}