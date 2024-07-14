import { Request, Response } from 'express';
import HttpMethod from '../../enum/httpMethod';
import Handler from '../../handlers/handler';
import Server from '../../models/server';
import { Interaction } from '../../utility/interaction';

const listServersHandler: Handler = {
    httpMethod: HttpMethod.GET,
    requireAuth: true,
    execute: async (interaction: Interaction) => {
        const userId = interaction.user?._id

        try {
            if (!userId) {
                return interaction.res.status(400).json({ message: 'Unable to find a user ID for this token.' });
            }

            // Query for servers where the user is a member
            const servers = await Server.find({ members: userId }, 'name _id');

            interaction.res.status(200).json(servers);
        } catch (error) {
            console.error('Error listing servers:', error);
            interaction.res.status(500).json({ message: 'Error listing servers' });
        }
    }
};

export default listServersHandler;
