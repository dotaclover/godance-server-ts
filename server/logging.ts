const winston = require('winston');

export default function () {
    winston.add(new winston.transports.Console());
    winston.add(new winston.transports.File({ filename: 'server_log.log' }));
    winston.exceptions.handle(new winston.transports.File({ filename: 'unhandledException.log' }));
    winston.rejections.handle(new winston.transports.File({ filename: 'unhandledRejection.log' }));
}