import { Request, Response } from "express";
import config from 'config';
import postService from "../services/postService";
import cacheService from "../services/cacheService";
import Joi from "joi";

class Index {
    async index(req: Request, res: Response) {
        res.send(`app_name=${config.get('app_name',)}`);
    }

    async cache(req: Request, res: Response) {
        await cacheService.set("name", {
            id: 1,
            userId: 1,
            title: "title 1",
            body: "this s a dummy conent."
        });
        const data = await cacheService.get("name");
        res.json({
            status: "ok",
            data
        });
    }

    async db(req: Request, res: Response) {

        const schema = Joi.object({
            id: Joi.number().required().min(1)
        });

        const result = schema.validate(req.query);
        // if (result?.error?.details[0]?.message)
        //     return res.status(400).send(result?.error?.details[0]?.message);

        const { id } = req.query;
        const post = await postService.getById(parseInt(id as string));
        return res.json(post);
    }
}

export default new Index();