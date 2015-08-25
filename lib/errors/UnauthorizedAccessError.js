function UnauthorizedAccessError(code, error) {
    if (error && error.message) {
        Error.call(this, error.message);
        this.message = error.message;
    }
    Error.captureStackTrace(this, this.constructor);
    this.name = "UnauthorizedAccessError";
    this.code = code;
    this.status = 401;
    this.inner = error;
}

UnauthorizedAccessError.prototype = Object.create(Error.prototype);
UnauthorizedAccessError.prototype.constructor = UnauthorizedAccessError;

module.exports = UnauthorizedAccessError;