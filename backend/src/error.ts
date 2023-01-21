export class CustomError extends Error {
  public status: number;

  constructor(status: 401 | 404 | 429 | 500, message?: string) {
    super(message);
    this.name = "CustomError";
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
