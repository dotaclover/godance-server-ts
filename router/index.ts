import { Application } from "express";
import index from '../controllers/index';
export default function (app: Application) {
    app.use('/', index.index);
}