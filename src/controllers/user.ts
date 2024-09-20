import { Request, Response } from "express";
import Joi from "joi";
import jwt from "../utils/jwt";
import userService from "../services/Logic/userService";

class User {
    async login(req: Request, res: Response) {
        const schema = Joi.object({
            username: Joi.string().required().min(3).message("username必须至少3位"),
            password: Joi.string().required().min(5).message("password必须至少5位")
        });

        const isValid = schema.validate(req.body);
        if (isValid.error)
            return res.status(400).send(isValid.error.details[0].message);

        const { username, password } = req.body;
        const user = await userService.find({
            where: { username, status: 1 }
        });

        if (!user || user.password !== password) {
            res.status(400).send("Invalid username or password");
            return;
        }

        const token = jwt.encode({ id: user.id, username: user.username });
        res.send({ token });
    }

    async getInfo(req: Request, res: Response) {
        let id: number = 0;
        if (req.user) id = req?.user?.id || 0;
        if (!id) {
            res.send({});
            return;
        }

        const user = await userService.getById(id);
        if (user) {
            res.send({ ...user.dataValues, password: "" });
            return;
        }
        res.send({});
    }

    async suspend(req: Request, res: Response) {
        const schema = Joi.object({
            id: Joi.number().required().min(1).message("username必须至少3位"),
        });

        const isValid = schema.validate(req.query);
        if (isValid.error)
            return res.status(400).send(isValid.error.details[0].message);

        const { id } = req.query;
        await userService.suspend(parseInt(id as string));

        res.send({ status: "ok" });


    }
}

export default new User();