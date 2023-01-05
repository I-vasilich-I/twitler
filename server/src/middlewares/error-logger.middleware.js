import { errorLogger } from 'express-winston';
import { logger } from '../logger/index.js';

export default errorLogger({
  winstonInstance: logger,
});
