import { Request, Response } from 'express';
const config = require('config');
const express = require('express');
const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send(`app_name=${config.get('app_name')}`);
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Server listen on port:${port}`));