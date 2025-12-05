export class ENOENTError extends Error implements NodeJS.ErrnoException {
  code: string = "ENOENT";
  path?: string;
  constructor(message: string, path?: string) {
    super(message);
    this.name = "ENOENTError";
    this.path = path;
    Object.setPrototypeOf(this, ENOENTError.prototype);
  }
}
