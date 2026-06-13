import { Order } from '@prisma/client';
import { OrdersRepository } from '../../repositories/orders-repository';

interface OrderItemRequest {
  productId: string;
  quantity: number;
}

interface CreateOrderUseCaseRequest {
  customerId: string;
  items: OrderItemRequest[];
}

interface CreateOrderUseCaseResponse {
  order: Order;
}

export class CreateOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    customerId,
    items,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (items.length === 0) {
      throw new Error('Order must have at least one item.');
    }

    const order = await this.ordersRepository.createWithTransaction(customerId, items);

    return {
      order,
    };
  }
}
