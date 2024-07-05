import { Request, Response } from 'express';
const express = require('express');
const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send("Hello, Godance!");
});

const port = process.env.NODE_ENV ?? 3000;
app.listen(port, () => console.log(`Server listen on port:${port}`));