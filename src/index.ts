import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './startup/logger';
import routing from './startup/router';
import config from './startup/config';
import { connectDatabase } from './startup/database';

const app = express();
routing(app);

//middlewares
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(helmet());

connectDatabase().then(() => {
    const port = config.get("app_port") || 5273;
    app.listen(port, () => logger.info(`Server listen on port:${port}`));
}).catch(error => {
    console.error('Failed to connect to the database:', error);
});

