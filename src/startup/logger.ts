import winston from "winston";
import config from "./config";

winston.exceptions.handle(new winston.transports.File({ filename: 'writable/unhandledException.log' }));
winston.rejections.handle(new winston.transports.File({ filename: 'writable/unhandledRejection.log' }));


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: config.get('app_name') },
    transports: [
        new winston.transports.File({ filename: 'writable/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'writable/combined.log' }),
    ],
});

//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

export default logger;