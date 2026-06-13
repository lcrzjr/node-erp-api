import { Product, Prisma } from '@prisma/client';

export interface ProductsRepository {
  create(data: Prisma.ProductCreateInput): Promise<Product>;
  findById(id: string): Promise<Product | null>;
}
