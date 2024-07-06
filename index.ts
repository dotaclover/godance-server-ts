import { Request, Response } from 'express';
import logging from './server/logging';
const config = require('config');
const morgan = require('morgan');

const express = require('express');
const app = express();

//config
logging();

//middlewares
app.use(morgan('tiny'));

app.get('/', (req: Request, res: Response) => {
    res.send(`app_name=${config.get('app_name',)}`);
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Server listen on port:${port}`));