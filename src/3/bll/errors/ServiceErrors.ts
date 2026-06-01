export class ServiceError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class ValidationError extends ServiceError {
  public constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ServiceError {
  public constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends ServiceError {
  public constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
