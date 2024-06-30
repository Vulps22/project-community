import { Request, Response } from "express";
import HttpMethod from "../enum/httpMethod";
import { PlatformPath } from "path";

export interface IInteraction {
    req: Request;
    res: Response;
    user?: any; // You can replace 'any' with your user type/interface
}

export class Interaction implements IInteraction {
    req: Request;
    res: Response;
    method: HttpMethod;
    path: PlatformPath;
    user?: any;

    constructor(req: Request, res: Response, method: HttpMethod, path: PlatformPath) {
        this.req = req;
        this.res = res;
        this.method = method
        this.path = path
    }
}