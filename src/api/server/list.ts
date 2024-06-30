import { Request, Response } from 'express';
import HttpMethod from '../../enum/httpMethod';
import Handler from '../../interfaces/handler';
import Server from '../../models/server';

const listServersHandler: Handler = {
    httpMethod: HttpMethod.GET,
    requireAuth: true,
    execute: async (req: Request, res: Response) => {
        const { userId } = req.body;

        try {
            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }

            // Query for servers where the user is a member
            const servers = await Server.find({ members: userId }, 'name _id');

            res.status(200).json(servers);
        } catch (error) {
            console.error('Error listing servers:', error);
            res.status(500).json({ message: 'Error listing servers' });
        }
    }
};

export default listServersHandler;
