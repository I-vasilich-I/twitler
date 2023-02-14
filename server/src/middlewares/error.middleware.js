import { ERROR_MESSAGES, STATUS_CODES } from '../constants.js';
import { ApiError } from '../exceptions/index.js';

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return next(err);
  }

  return res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
};

export default errorMiddleware;
