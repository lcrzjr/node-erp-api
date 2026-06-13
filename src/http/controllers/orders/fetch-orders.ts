import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaOrdersRepository } from '../../../repositories/prisma/prisma-orders-repository';
import { FetchOrdersUseCase } from '../../../usecases/orders/fetch-orders';

export async function fetchOrders(request: FastifyRequest, reply: FastifyReply) {
  const fetchOrdersQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = fetchOrdersQuerySchema.parse(request.query);

  const ordersRepository = new PrismaOrdersRepository();
  const fetchOrdersUseCase = new FetchOrdersUseCase(ordersRepository);

  const { orders } = await fetchOrdersUseCase.execute({
    page,
  });

  return reply.status(200).send({ orders });
}
