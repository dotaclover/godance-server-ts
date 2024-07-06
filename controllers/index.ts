import { Request, Response } from "express";
const config = require('config');

export default {
    async index(req: Request, res: Response) {
    res.send(`app_name=${config.get('app_name',)}`);
        
    }
}