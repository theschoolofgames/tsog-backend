function NotFoundError(error) {
    Error.call(this, typeof error === "undefined" ? undefined : error.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "NotFoundError";
    this.message = typeof error === "undefined" ? undefined : error.message;
    this.status = 404;
    this.inner = error;
}

NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;