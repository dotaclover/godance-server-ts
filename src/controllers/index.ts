import Joi from "joi";
import config from 'config';
import mongoose from 'mongoose';
import { Request, Response } from "express";
import mongoLog from "../services/mongoLog";
import cacheService from "../services/cacheService";
import todoService from "../services/Logic/todoService";
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
        if (result?.error?.details[0]?.message)
            return res.status(400).send(result?.error?.details[0]?.message);

        const { id } = req.query;
        await todoService.create({
            userId: 1,
            title: "hello",
            completed: false
        })
        const todo = await todoService.getAll();
        return res.json(todo);
    }

    async mongo(req: Request, res: Response) {
        const schema = Joi.object({
            id: Joi.string().length(24).hex().required()
        });
        const result = schema.validate(req.query);

        await mongoose.connect('mongodb://127.0.0.1:27017/test')
        if (result?.error?.details[0]?.message)
            return res.status(400).send(result?.error?.details[0]?.message);

        const { id } = req.query;
        const log = await mongoLog.getById(id as string);
        return res.json(log);
    }
}

export default new Index();