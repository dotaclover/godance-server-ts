import { Application } from "express";
import router from "../router";

export default function (app: Application) {
    router(app);
}