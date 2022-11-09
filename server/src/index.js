import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { router } from './router/index.js'

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
}

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', router);
app.use('/public', express.static("public"))

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
  } catch (error) {
    console.log(error)
  }
}

start();