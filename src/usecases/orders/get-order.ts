import { Order } from '@prisma/client';
import { OrdersRepository } from '../../repositories/orders-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

interface GetOrderUseCaseRequest {
  id: string;
}

interface GetOrderUseCaseResponse {
  order: Order;
}

export class GetOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ id }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new ResourceNotFoundError('Order not found.');
    }

    return {
      order,
    };
  }
}
