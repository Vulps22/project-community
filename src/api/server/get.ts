import { Request, Response } from 'express';
import HttpMethod from '../../enum/httpMethod';
import Handler from '../../handlers/handler';
import Server from '../../models/server';
import User from '../../models/user';
import { Interaction } from '../../utility/interaction';

const getServerHandler: Handler = {
    httpMethod: HttpMethod.GET,
    requireAuth: true,
    execute: async (interaction: Interaction) => {
        const serverId = interaction.req.query.serverId as string;

        const userId = interaction.user?._id;

        try {
            if (!userId) {
                return interaction.res.status(400).json({ message: 'userId is required' });
            }

            if (!serverId) {
                return interaction.res.status(400).json({ message: 'serverId is required' });
            }

            // Query for a server where the user is a member
            const server = await Server.findOne({ _id: serverId, members: userId }).populate('ownerId', ['_id', 'id', 'username', 'profile']).populate('members', ['_id', 'id', 'username', 'profile']).populate('channels');

            if (!server) {
                return interaction.res.status(404).json({ message: 'Server not found or user is not a member' })
            }

            interaction.res.status(200).json(server);
        } catch (error) {
            console.error('Error retrieving server:', error);
            interaction.res.status(500).json({ message: 'Error retrieving server' });
        }
    }
};

export default getServerHandler;
