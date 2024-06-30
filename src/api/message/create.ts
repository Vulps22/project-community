import { Request, Response } from "express";
import HttpMethod from "../../enum/httpMethod";
import Handler from "../../interfaces/handler";
import Message from "../../models/message";
import { Interaction } from "../../utility/interaction";

const createMessageHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: true,

    execute: async (interaction: Interaction) => {
        const { content, channelId, serverId, sender } = interaction.req.body;

        if (!content || !channelId || !serverId || !sender) {
            return interaction.res.status(400).json({ message: 'Missing required parameters' });
        }
        const newMessage = new Message({
            serverId,
            channelId,
            sender,
            content,
        });

        const savedMessage = await newMessage.save();

        interaction.res.json({ message: 'Message created successfully', data: savedMessage });
    }
}

export default createMessageHandler;
