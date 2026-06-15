import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaProductsRepository } from '../../../repositories/prisma/prisma-products-repository';
import { GetProductUseCase } from '../../../usecases/products/get-product';

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const getProductParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = getProductParamsSchema.parse(request.params);

  const productsRepository = new PrismaProductsRepository();
  const getProductUseCase = new GetProductUseCase(productsRepository);

  const { product } = await getProductUseCase.execute({
    id,
  });

  return reply.status(200).send({ product });
}
