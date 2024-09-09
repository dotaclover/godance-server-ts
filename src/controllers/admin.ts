import { Request, Response } from "express";
import Joi from "joi";
import jwt from "../utils/jwt";

const admin = {
    id: 1,
    isAdmin: true,
    username: 'admin',
    password: '123456'
}
class Admin {
    async login(req: Request, res: Response) {
        const schema = Joi.object({
            username: Joi.string().required().min(3).message("username必须至少3位"),
            password: Joi.string().required().min(5).message("password必须至少5位")
        });

        const isValid = schema.validate(req.body);
        if (isValid.error)
            return res.status(400).send(isValid.error.details[0].message);

        const { username, password } = req.body;
        if (username !== admin.username || password !== admin.password) {
            res.status(400).send("Invalid username or password");
            return;
        }

        const token = jwt.encode({ id: admin.id, username: admin.username });
        res.send({ token });
    }

    async getInfo(req: Request, res: Response) {
        let id: number = 0;
        if (req.user) id = req?.user?.id || 0;

        if (id == admin.id)
            return res.send({ ...admin, password: "" });
        res.send({});
    }
}

export default new Admin();