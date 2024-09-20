import { Application } from "express";
import router from "../router";

function routing(app: Application) {
    router(app);
}

export default routing;