class ApiError extends Error {
    constructor(statusCode, message = "Something Went Wrong", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
