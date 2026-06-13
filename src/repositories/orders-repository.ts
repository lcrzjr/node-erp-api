import { Order, Prisma } from '@prisma/client';

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrdersRepository {
  createWithTransaction(customerId: string, items: OrderItemInput[]): Promise<Order>;
}
