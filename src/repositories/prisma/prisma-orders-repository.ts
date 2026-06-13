import { prisma } from '../../lib/prisma';
import { OrderItemInput, OrdersRepository } from '../orders-repository';

export class PrismaOrdersRepository implements OrdersRepository {
  async createWithTransaction(customerId: string, items: OrderItemInput[]) {
    // We use Prisma $transaction to ensure everything succeeds or fails together
    return prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      const productsInfo = await Promise.all(
        items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product with ID ${item.productId} not found.`);
          }

          if (product.stockQuantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}.`);
          }

          return {
            ...item,
            unitPrice: product.price,
          };
        })
      );

      // 2. Deduct stock
      for (const item of productsInfo) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        totalAmount += Number(item.unitPrice) * item.quantity;
      }

      // 3. Create the order with its items
      const order = await tx.order.create({
        data: {
          customerId,
          totalAmount,
          items: {
            create: productsInfo.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      });

      return order;
    });
  }
}
