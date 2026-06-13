import { Order, Prisma } from '@prisma/client';

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface OrdersRepository {
  createWithTransaction(customerId: string, items: OrderItemInput[]): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findMany(page: number): Promise<Order[]>;
}
