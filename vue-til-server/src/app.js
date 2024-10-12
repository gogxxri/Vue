// libs
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import detectPort from 'detect-port';
import chalk from 'chalk';

// api
import auth from './api/auth.js';
import posts from './api/posts.js';
import docs from './utils/api-doc.js';

// utils
import { authenticateUser } from './utils/auth.js';

// mongo db

require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB 연결 성공!'))
    .catch(err => {
        console.error('MongoDB 연결 실패:', err);
        console.log('MongoDB URI:', process.env.MONGODB_URI);
        process.exit(1);
    });


// server setup
let port;
async function configServer() {
  port = 3000 || (await detectPort(3000));
}
configServer();

// express setup
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev')); // log request

// express routers
app.use('/', auth);
app.use('/posts', authenticateUser, posts);

// api docs
app.use('/api', docs);

// start
app.listen(port, () =>
  console.log(
    `${chalk.white
      .bgHex('#41b883')
      .bold(`VUE TIL SERVER IS RUNNING ON ${port}`)}`,
  ),
);
