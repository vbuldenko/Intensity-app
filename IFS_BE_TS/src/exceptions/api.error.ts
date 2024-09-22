export class ApiError extends Error {
  status: number;
  errors: any;

  constructor(status: number, message: string, errors: any = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message: string, errors: any = {}) {
    return new ApiError(400, message, errors);
  }

  static Unauthorized() {
    return new ApiError(401, 'Not authorized', { user: 'Not authorized' });
  }

  static Forbidden(message: string) {
    return new ApiError(403, message);
  }

  static NotFound(errors?: any) {
    return new ApiError(404, 'Not found', errors);
  }
}
