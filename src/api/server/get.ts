import { Request, Response } from 'express';
import HttpMethod from '../../enum/httpMethod';
import Handler from '../../interfaces/handler';
import Server from '../../models/server';
import User from '../../models/user';

const getServerHandler: Handler = {
    httpMethod: HttpMethod.GET,
    requireAuth: true,
    execute: async (req: Request, res: Response) => {
        const { userId, serverId } = req.body;

        try {
            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }

            if (!serverId) {
                return res.status(400).json({ message: 'serverId is required' });
            }

            // Query for a server where the user is a member
            const server = await Server.findOne({ _id: serverId, members: userId }).populate('ownerId', ['_id', 'id', 'username', 'profile']).populate('members', ['_id', 'id', 'username', 'profile']).populate('channels');

            if (!server) {
                return res.status(404).json({ message: 'Server not found or user is not a member' })
            }

            res.status(200).json(server);
        } catch (error) {
            console.error('Error retrieving server:', error);
            res.status(500).json({ message: 'Error retrieving server' });
        }
    }
};

export default getServerHandler;
