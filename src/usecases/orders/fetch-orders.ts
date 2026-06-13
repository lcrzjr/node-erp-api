import { Order } from '@prisma/client';
import { OrdersRepository } from '../../repositories/orders-repository';

interface FetchOrdersUseCaseRequest {
  page: number;
}

interface FetchOrdersUseCaseResponse {
  orders: Order[];
}

export class FetchOrdersUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ page }: FetchOrdersUseCaseRequest): Promise<FetchOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findMany(page);

    return {
      orders,
    };
  }
}
