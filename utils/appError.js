export default class AppError extends Error {
  constructor(message, statusCode, errorName = "AppError") {
    super(message);
    this.statusCode = statusCode || 500;
    //   this.name = this.constructor.name;
    this.name = errorName;
    Error.captureStackTrace(this, this.constructor);
  }
}
