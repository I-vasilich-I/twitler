import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './router/index.js';
import { logger } from './logger/index.js';
import reqLoggerMiddleware from './midlewares/request-logger.middleware.js';
import errLoggerMiddleware from './midlewares/error-logger.middleware.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(reqLoggerMiddleware);
app.use('/api', router);
app.use('/public', express.static('public'));
app.use(errLoggerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(PORT, () => logger.info(`Server started on port = ${PORT}`));
  } catch (error) {
    logger.error(error);
  }
};

start();
