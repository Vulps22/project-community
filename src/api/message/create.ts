import { Request, Response } from "express";
import HttpMethod from "../../enum/httpMethod";
import Handler from "../../interfaces/handler";

const createMessageHandler: Handler = {
    httpMethod: HttpMethod.POST,
    requireAuth: true,

    execute: (req: Request, res: Response) => {
        const {text, sender} = req.body;

        res.json({message: "Message created successfully", text, sender});
    }
}

export default createMessageHandler;