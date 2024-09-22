import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import logger from './logger';
import routing from './router';
import { connectDatabase } from './database';

const app = express();
app.use(express.json());
routing(app);

//middlewares
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(helmet());

//launch server
connectDatabase().then(async () => {
    const port = config.get("app_port") || 8787;
    app.listen(port, () => logger.info(`Server listen on port:${port}`));
}).catch(error => {
    console.error('Failed to connect to the database:', error);
});