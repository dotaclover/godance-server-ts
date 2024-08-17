import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './startup/logger';
import router from './startup/router';
import config from './startup/config';

//express
const app = express();

//middlewares
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use(helmet());

//set routes
router(app);

const port = config.get("app_port") || 5273;
app.listen(port, () => logger.info(`Server listen on port:${port}`));