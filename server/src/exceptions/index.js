/* eslint-disable max-classes-per-file */
import { ERROR_MESSAGES, STATUS_CODES } from '../constants.js';

const {
  BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, CONFLICT,
} = ERROR_MESSAGES;

class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

class BadRequestException extends ApiError {
  constructor(message = BAD_REQUEST, errors = []) {
    super(STATUS_CODES.BAD_REQUEST, message, errors);
  }
}

class NotFoundException extends ApiError {
  constructor(message = NOT_FOUND, errors = []) {
    super(STATUS_CODES.NOT_FOUND, message, errors);
  }
}

class ConflictException extends ApiError {
  constructor(message = CONFLICT, errors = []) {
    super(STATUS_CODES.CONFILCT, message, errors);
  }
}

class UnauthorizedRequestException extends ApiError {
  constructor(messaage = UNAUTHORIZED, errors = []) {
    super(STATUS_CODES.UNAUTHORIZED, messaage, errors);
  }
}

export {
  BadRequestException, UnauthorizedRequestException, NotFoundException, ConflictException,
};
