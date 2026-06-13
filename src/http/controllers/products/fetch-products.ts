import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProductsRepository } from '../../../repositories/prisma/prisma-products-repository';
import { FetchProductsUseCase } from '../../../usecases/products/fetch-products';

export async function fetchProducts(request: FastifyRequest, reply: FastifyReply) {
  const fetchProductsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = fetchProductsQuerySchema.parse(request.query);

  const productsRepository = new PrismaProductsRepository();
  const fetchProductsUseCase = new FetchProductsUseCase(productsRepository);

  const { products } = await fetchProductsUseCase.execute({
    page,
  });

  return reply.status(200).send({ products });
}
