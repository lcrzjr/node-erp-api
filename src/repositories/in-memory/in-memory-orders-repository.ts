import { Order, OrderItem, Prisma } from '@prisma/client';
import { OrderItemInput, OrdersRepository } from '../orders-repository';
import { randomUUID } from 'crypto';
import { InMemoryProductsRepository } from './in-memory-products-repository';
import { InMemoryCustomersRepository } from './in-memory-customers-repository';
import { ResourceNotFoundError } from '../../usecases/errors/resource-not-found-error';
import { InsufficientStockError } from '../../usecases/errors/insufficient-stock-error';

export class InMemoryOrdersRepository implements OrdersRepository {
  public items: Order[] = [];
  public orderItems: OrderItem[] = [];

  constructor(
    private productsRepository: InMemoryProductsRepository,
    private customersRepository: InMemoryCustomersRepository
  ) {}

  async createWithTransaction(customerId: string, inputItems: OrderItemInput[]) {
    const customer = await this.customersRepository.findById(customerId);
    if (!customer) {
      throw new ResourceNotFoundError(`Customer with ID ${customerId} not found.`);
    }
    let totalAmount = new Prisma.Decimal(0);

    const productsInfo = await Promise.all(
      inputItems.map(async (item) => {
        const product = await this.productsRepository.findById(item.productId);

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

    // 2. Phase 1: Deduct stock check (simulate atomicity)
    for (const item of productsInfo) {
      const productIndex = this.productsRepository.items.findIndex(
        (p) => p.id === item.productId
      );
      const product = this.productsRepository.items[productIndex];

      if (product.stockQuantity < item.quantity) {
        throw new InsufficientStockError(`Insufficient stock for product ${item.name}.`);
      }
    }

    // 3. Phase 2: Apply mutations
    for (const item of productsInfo) {
      const productIndex = this.productsRepository.items.findIndex(
        (p) => p.id === item.productId
      );
      this.productsRepository.items[productIndex].stockQuantity -= item.quantity;

      const itemTotal = item.unitPrice.mul(item.quantity);
      totalAmount = totalAmount.add(itemTotal);
    }

    const orderId = randomUUID();

    const order: Order = {
      id: orderId,
      customerId,
      totalAmount,
      createdAt: new Date(),
    };

    this.items.push(order);

    for (const item of productsInfo) {
      this.orderItems.push({
        id: randomUUID(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      });
    }

    return order;
  }

  async findById(id: string) {
    const order = this.items.find((item) => item.id === id);
    if (!order) {
        return null;
    }
    // We are returning order with relation but typing is Order in repository.
    // In actual implementation findById includes relationships. We can cast for in-memory or ignore
    return order as any;
  }

  async findMany(page: number) {
    return this.items.slice((page - 1) * 20, page * 20);
  }
}
