import mongoose from "mongoose";
import config from "config";
import winston from "winston";

export default new class {
    async connect() {
        mongoose.connect(config.get("mongodb.url"))
            .then((res) => console.log("mongo connect success"))
            .catch((err) => {
                winston.error(err);
                process.exit(1);
            })
    }
}

