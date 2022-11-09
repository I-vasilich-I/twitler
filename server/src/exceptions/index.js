class ApiError extends Error {
  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

class BadRequestException extends ApiError {
  constructor(message = 'Bad request', errors = []) {
    super(400, message, errors)
  }
}

class UnauthorizedRequestException extends ApiError {
  constructor(messaage = "User unauthorized", errors = []) {
    super(401, messaage, errors)
  }
}

export { BadRequestException,  UnauthorizedRequestException }