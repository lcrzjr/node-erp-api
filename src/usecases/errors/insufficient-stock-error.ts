export class InsufficientStockError extends Error {
  constructor(message: string = 'Insufficient stock.') {
    super(message);
    this.name = 'InsufficientStockError';
  }
}
