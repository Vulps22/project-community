import { Request, Response } from "express";
import HttpMethod from "../../enum/httpMethod";
import Handler from "../../handlers/handler";
import Message from "../../models/message";
import { Interaction } from "../../utility/interaction";

const createMessageHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: true,

    execute: async (interaction: Interaction) => {
        const { content, channelId, serverId } = interaction.req.body;

        const sender = interaction.user?._id;

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
