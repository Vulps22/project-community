import { Request, Response } from 'express';
import HttpMethod from '../enum/httpMethod';
interface Handler {
    httpMethod: HttpMethod,
    requireAuth: boolean,
    execute(req: Request, res: Response): void;
}

export default Handler;