export class ApiError extends Error {
    constructor(status, message, errors = {}) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static BadRequest(message, errors = {}) {
        return new ApiError(400, message, errors);
    }
    static Unauthorized(message) {
        return new ApiError(401, 'Not authorized', {
            user: 'Not authorized',
            message,
        });
    }
    static Forbidden(message) {
        return new ApiError(403, message);
    }
    static NotFound(errors) {
        return new ApiError(404, 'Not found', errors);
    }
}
