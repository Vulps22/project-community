import { Request, Response } from 'express';
import HttpMethod from '../../enum/httpMethod';
import Handler from '../../interfaces/handler';
import Message from '../../models/message';
import { Interaction } from '../../utility/interaction';
import Server from '../../models/server';

const listMessagesHandler: Handler = {
    httpMethod: HttpMethod.GET,
    requireAuth: true,
    execute: async (interaction: Interaction) => {
        const { serverId, channelId, page = 1 } = interaction.req.body;

        const limitNumber = 500;

        try {
            if (!serverId) {
                return interaction.res.status(400).json({ message: 'serverId is required' });
            }

            if (!channelId) {
                return interaction.res.status(400).json({ message: 'channelId is required' });
            }

            // Convert page and limit to numbers
            const pageNumber = parseInt(page as string, 10);

            // Calculate the number of documents to skip
            const skip = (pageNumber - 1) * limitNumber;

            // Query to get the most recent messages with pagination
            const messages = await Message.find({ serverId, channelId })
                .sort({ timestamp: -1 }) // Sort by timestamp in descending order
                .skip(skip)
                .limit(limitNumber)
                .populate('sender', ['-passwordHash', '-email']);

            interaction.res.status(200).json(messages);
        } catch (error) {
            console.error('Error listing messages:', error);
            interaction.res.status(500).json({ message: 'Error listing messages' });
        }
    }
};

export default listMessagesHandler;
