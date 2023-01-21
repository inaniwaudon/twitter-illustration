export class Error404 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Error404";
    Object.setPrototypeOf(this, Error404.prototype);
  }
}

export class Error500 extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Error500";
    Object.setPrototypeOf(this, Error500.prototype);
  }
}
