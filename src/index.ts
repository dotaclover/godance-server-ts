import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './startup/logger';
import router from './startup/router';
import config from './startup/config';

//
const app = express();

//middlewares
app.use(express.json());
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
} else {
    app.use(morgan('tiny'));
}

//
router(app);

const port = config.get("app_port") || 5273;
app.listen(port, () => logger.info(`Server listen on port:${port}`));