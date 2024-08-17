import express, { Application } from "express";
import index from '../controllers/index';
import admin from "./admin";

const router = express.Router();
router.get('/', index.index);

export default function (app: Application) {
    app.use('/', router);
    app.use("/admin", admin);
}