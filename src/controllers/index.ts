import config from 'config';
import { Request, Response } from "express";

class Index {
    async index(req: Request, res: Response) {
        res.send(`app_name=${config.get('app_name',)}`);
    }
}

export default new Index();