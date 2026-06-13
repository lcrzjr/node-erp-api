import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaOrdersRepository } from '../../../repositories/prisma/prisma-orders-repository';
import { CreateOrderUseCase } from '../../../usecases/orders/create-order';

export async function createOrder(request: FastifyRequest, reply: FastifyReply) {
  const createOrderBodySchema = z.object({
    customerId: z.string().uuid(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid(),
          quantity: z.number().int().positive(),
        })
      )
      .min(1, 'Order must have at least one item.'),
  });

  const { customerId, items } = createOrderBodySchema.parse(request.body);

  const ordersRepository = new PrismaOrdersRepository();
  const createOrderUseCase = new CreateOrderUseCase(ordersRepository);

  try {
    const { order } = await createOrderUseCase.execute({
      customerId,
      items,
    });

    return reply.status(201).send({ order });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({ message: error.message });
    }
    throw error;
  }
}
