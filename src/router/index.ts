import express, { Application } from "express";
import handleAsync from "../middleware/handleAsync";
import index from '../controllers/index';
import admin from "./admin";

const router = express.Router();
router.get('/', handleAsync(index.index));

const routing = function (app: Application) {
    app.use('/', router);
    app.use("/admin", admin);
}

export default routing;