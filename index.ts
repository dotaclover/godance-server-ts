import logging from './startup/logging';
import router from './startup/router';
import types from './types/express';
import express from 'express';
import morgan from 'morgan';
const app = express();
app.use(express.json());
app.use(morgan('tiny'));

//startup
logging();
router(app);

//middlewares


const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Server listen on port:${port}`));