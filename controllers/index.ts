import { Request, Response } from "express";
import config from 'config';

export default new class {
    async index(req: Request, res: Response) {
        res.send(`app_name=${config.get('app_name',)}`);
    }
}