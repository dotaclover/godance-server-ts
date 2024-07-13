import { Request, Response } from "express";
import jwt from "../utils/jwt";

const admin = {
    id: 1,
    isAdmin: true,
    username: 'admin',
    password: '123456'
}
export default new class {
    async login(req: Request, res: Response) {
        const { username, password } = req.body;
        if (username !== admin.username || password !== admin.password) {
            res.status(400).send("Invalid username or password");
            return;
        }

        const token = jwt.encode({ id: admin.id, username: admin.username });
        res.send({ token });
    }

    async getInfo(req: Request, res: Response) {
        const { id } = req.user as User;
        if (id == admin.id)
            return res.send({ ...admin, password: "" });
        res.send({});
    }
}