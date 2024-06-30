import { Request, Response } from "express";
import HttpMethod from "../../enum/httpMethod";
import Handler from "../../interfaces/handler";
import Message from "../../models/message";

const createMessageHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: true,

    execute: async (req: Request, res: Response) => {
        const { content, channelId, serverId, sender } = req.body;

        if (!content || !channelId || !serverId || !sender) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }
        const newMessage = new Message({
            serverId,
            channelId,
            sender,
            content,
        });

        const savedMessage = await newMessage.save();

        res.json({ message: 'Message created successfully', data: savedMessage });
    }
}

export default createMessageHandler;
