import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logging from './startup/logging';
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
logging();
router(app);

const port = config.get("port") || "5273";
app.listen(port, () => console.log(`Server listen on port:${port}`));