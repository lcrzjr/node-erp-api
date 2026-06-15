import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { OrderItemInput, OrdersRepository } from '../orders-repository';
import { ResourceNotFoundError } from '../../usecases/errors/resource-not-found-error';
import { InsufficientStockError } from '../../usecases/errors/insufficient-stock-error';

export class PrismaOrdersRepository implements OrdersRepository {
  async createWithTransaction(customerId: string, items: OrderItemInput[]) {
    // We use Prisma $transaction to ensure everything succeeds or fails together
    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { id: customerId },
      });

      if (!customer) {
        throw new ResourceNotFoundError(`Customer with ID ${customerId} not found.`);
      }

      let totalAmount = new Prisma.Decimal(0);

      const productsInfo = await Promise.all(
        items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new ResourceNotFoundError(`Product with ID ${item.productId} not found.`);
          }

          return {
            ...item,
            unitPrice: product.price,
            name: product.name,
          };
        })
      );

      // 2. Deduct stock atomically
      for (const item of productsInfo) {
        const updateResult = await tx.product.updateMany({
          where: {
            id: item.productId,
            stockQuantity: {
              gte: item.quantity,
            },
          },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        if (updateResult.count === 0) {
          throw new InsufficientStockError(`Insufficient stock for product ${item.name}.`);
        }

        const itemTotal = item.unitPrice.mul(item.quantity);
        totalAmount = totalAmount.add(itemTotal);
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

  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return order;
  }

  async findMany(page: number) {
    const orders = await prisma.order.findMany({
      take: 20,
      skip: (page - 1) * 20,
    });
    return orders;
  }
}
