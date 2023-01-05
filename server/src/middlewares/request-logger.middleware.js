import { logger, requestWhitelist, responseWhitelist } from 'express-winston';
import { requestLogger } from '../logger/index.js';

requestWhitelist.push('body');
responseWhitelist.push('body');

export default logger({
  winstonInstance: requestLogger,
  statusLevels: true,
});
