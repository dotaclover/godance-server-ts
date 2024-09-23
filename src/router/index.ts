import express, { Application } from "express";
import handleAsync from "../middlewares/handleAsync";
import index from '../controllers/index';
import user from "./user";

const router = express.Router();
router.get('/', handleAsync(index.index));

const routing = function (app: Application) {
    app.use('/', router);
    app.use("/user", user);
}

export default routing;