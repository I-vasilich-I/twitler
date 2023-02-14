import { transports, format, createLogger } from 'winston';
import { LOGS_DIR_PATH, LOG_LEVELS } from '../constants.js';

const LOG_FILES = {
  LOG: `${LOGS_DIR_PATH}/logs.log`,
  REQ_WARN: `${LOGS_DIR_PATH}/req_warn.log`,
  REQ_ERROR: `${LOGS_DIR_PATH}/req_error.log`,
  REQ_INFO: `${LOGS_DIR_PATH}/req_info.log`,
};

const loggerTransports = [
  new transports.File({
    level: LOG_LEVELS.INFO,
    filename: LOG_FILES.LOG,
  }),
];

const requestLoggerTransports = [
  new transports.File({
    level: LOG_LEVELS.WARN,
    filename: LOG_FILES.REQ_WARN,
  }),
  new transports.File({
    level: LOG_LEVELS.ERROR,
    filename: LOG_FILES.REQ_ERROR,
  }),
];

if (process.env.NODE_ENV !== 'production') {
  loggerTransports.push(
    new transports.Console(),
  );

  requestLoggerTransports.push(
    new transports.File({
      level: LOG_LEVELS.INFO,
      filename: LOG_FILES.REQ_INFO,
    }),
  );
}

const logger = createLogger({
  transports: loggerTransports,
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.prettyPrint(),
  ),
});

const requestLogger = createLogger({
  transports: requestLoggerTransports,
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.prettyPrint(),
  ),
});

export { logger, requestLogger };
