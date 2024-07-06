import logging from './server/logging';
import router from './server/router';
const morgan = require('morgan');
const express = require('express');
const app = express();

//startup
logging();
router(app);

//middlewares
app.use(morgan('tiny'));

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Server listen on port:${port}`));