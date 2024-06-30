import { Request, Response } from 'express';
import HttpMethod from '../../enum/httpMethod';
import Handler from '../../interfaces/handler';
import Server, { IServer } from '../../models/server';
import ChannelType from '../../enum/channelType';
import { IChannel } from '../../models/channel';
import { Interaction } from '../../utility/interaction';

const createServerHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: true,
    execute: async (interaction: Interaction) => {
        const { name, ownerId } = interaction.req.body;

        try {
            // Validate ownerId
            if (!ownerId) {
                return interaction.res.status(400).json({ message: 'ownerId is required' });
            }

            // Create the server instance
            const newServer = new Server({
                name,
                description: '',
                ownerId,
                createdAt: new Date(),
                channels: [],  // Initialize empty array for channels
                members: [ownerId],
            });

            // Add a default channel using the schema's create method
            const defaultChannel: IChannel = newServer.channels?.create({
                name: 'general',
                type: ChannelType.TEXT,
                createdAt: new Date()
            });

            // Add the default channel to the channels array
            newServer.channels.push(defaultChannel);

            // Save the server to the database
            const savedServer = await newServer.save();

            interaction.res.status(201).json(savedServer);
        } catch (error) {
            console.error('Error creating server:', error);
            interaction.res.status(500).json({ message: 'Error creating server' });
        }
    }
};

export default createServerHandler;
