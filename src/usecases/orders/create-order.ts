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

    const aggregatedItemsMap = new Map<string, number>();

    for (const item of items) {
      const currentQty = aggregatedItemsMap.get(item.productId) || 0;
      aggregatedItemsMap.set(item.productId, currentQty + item.quantity);
    }

    const aggregatedItems = Array.from(aggregatedItemsMap.entries()).map(
      ([productId, quantity]) => ({
        productId,
        quantity,
      })
    );

    const order = await this.ordersRepository.createWithTransaction(customerId, aggregatedItems);

    return {
      order,
    };
  }
}
