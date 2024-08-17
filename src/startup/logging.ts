import winston from "winston";

export default function () {
    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File({ filename: 'writeable/express.log' }));
    winston.exceptions.handle(new winston.transports.File({ filename: 'writeable/unhandledException.log' }));
    winston.rejections.handle(new winston.transports.File({ filename: 'writeable/unhandledRejection.log' }));
}