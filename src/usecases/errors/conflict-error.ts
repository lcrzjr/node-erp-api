export class ConflictError extends Error {
  constructor(message: string = 'Resource conflict.') {
    super(message);
    this.name = 'ConflictError';
  }
}
