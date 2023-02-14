/* eslint-disable no-plusplus */
import cluster from 'cluster';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { cpus } from 'os';
import router from './router/index.js';
import { logger } from './logger/index.js';
import reqLoggerMiddleware from './middlewares/request-logger.middleware.js';
import errLoggerMiddleware from './middlewares/error-logger.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(reqLoggerMiddleware);
app.use('/api', router);
app.use('/public', express.static('public'));
app.use(errLoggerMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const numCPUs = cpus().length;

const start = async () => {
  if (cluster.isPrimary) {
    logger.info(`Primary ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker) => {
      logger.info(`worker ${worker.process.pid} died`);
    });
  } else {
    try {
      app.listen(PORT, () => logger.info(`Server thread with process id: ${process.pid} started on port: ${PORT}`));
    } catch (error) {
      logger.error(error);
    }
  }
};

start();
