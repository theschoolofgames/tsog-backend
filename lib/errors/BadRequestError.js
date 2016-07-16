function BadRequestError(error) {
    if (error && error.message) {
        Error.call(this, error.message);
        this.message = error.message;
    }
    Error.captureStackTrace(this, this.constructor);
    this.name = "BadRequestError";
    this.status = 400;
    this.inner = error;
}

BadRequestError.prototype = Object.create(Error.prototype);
BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;