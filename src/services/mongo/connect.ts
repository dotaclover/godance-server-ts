
import mongoose from "mongoose";
import winston from "winston";
import config from "config";

const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(config.get<string>("mongodb.url"));
        console.log("MongoDB connection successful");
    } catch (err) {
        winston.error(err);
        process.exit(1);
    }
}

export default connect;