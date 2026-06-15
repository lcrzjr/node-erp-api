import { Product, Prisma } from '@prisma/client';
import { ProductsRepository } from '../products-repository';
import { randomUUID } from 'crypto';

export class InMemoryProductsRepository implements ProductsRepository {
  public items: Product[] = [];

  async create(data: Prisma.ProductCreateInput) {
    const product = {
      id: data.id ?? randomUUID(),
      name: data.name,
      price: new Prisma.Decimal(data.price.toString()),
      stockQuantity: data.stockQuantity ?? 0,
      createdAt: new Date(),
    };

    this.items.push(product);

    return product;
  }

  async findById(id: string) {
    const product = this.items.find((item) => item.id === id);
    return product || null;
  }

  async findMany(page: number) {
    return this.items.slice((page - 1) * 20, page * 20);
  }
}
