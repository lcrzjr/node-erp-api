import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaOrdersRepository } from '../../../repositories/prisma/prisma-orders-repository';
import { GetOrderUseCase } from '../../../usecases/orders/get-order';

export async function getOrder(request: FastifyRequest, reply: FastifyReply) {
  const getOrderParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = getOrderParamsSchema.parse(request.params);

  const ordersRepository = new PrismaOrdersRepository();
  const getOrderUseCase = new GetOrderUseCase(ordersRepository);

  const { order } = await getOrderUseCase.execute({
    id,
  });

  return reply.status(200).send({ order });
}
