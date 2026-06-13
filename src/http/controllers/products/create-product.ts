import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProductsRepository } from '../../../repositories/prisma/prisma-products-repository';
import { CreateProductUseCase } from '../../../usecases/products/create-product';

export async function createProduct(request: FastifyRequest, reply: FastifyReply) {
  const createProductBodySchema = z.object({
    name: z.string(),
    price: z.number().positive(),
    stockQuantity: z.number().int().nonnegative().default(0),
  });

  const { name, price, stockQuantity } = createProductBodySchema.parse(request.body);

  const productsRepository = new PrismaProductsRepository();
  const createProductUseCase = new CreateProductUseCase(productsRepository);

  const { product } = await createProductUseCase.execute({
    name,
    price,
    stockQuantity,
  });

  return reply.status(201).send({ product });
}
