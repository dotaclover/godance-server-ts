import express, { Application } from "express";
import handleAsync from "../middlewares/handleAsync";
import index from '../controllers/index';
import admin from "./admin";

const router = express.Router();
router.get('/', handleAsync(index.index));
router.get('/cache', handleAsync(index.cache));
router.get('/db', handleAsync(index.db));
router.get('/mongo', handleAsync(index.mongo));

const routing = function (app: Application) {
    app.use('/', router);
    app.use("/admin", admin);
}

export default routing;

