import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { ProductsRepository } from '../products-repository';

export class PrismaProductsRepository implements ProductsRepository {
  async create(data: Prisma.ProductCreateInput) {
    const product = await prisma.product.create({
      data,
    });
    return product;
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    return product;
  }
}
