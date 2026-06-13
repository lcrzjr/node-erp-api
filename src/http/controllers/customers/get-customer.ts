import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCustomersRepository } from '../../../repositories/prisma/prisma-customers-repository';
import { GetCustomerUseCase } from '../../../usecases/customers/get-customer';

export async function getCustomer(request: FastifyRequest, reply: FastifyReply) {
  const getCustomerParamsSchema = z.object({
    id: z.string().uuid(),
  });

  const { id } = getCustomerParamsSchema.parse(request.params);

  const customersRepository = new PrismaCustomersRepository();
  const getCustomerUseCase = new GetCustomerUseCase(customersRepository);

  try {
    const { customer } = await getCustomerUseCase.execute({
      id,
    });

    return reply.status(200).send({ customer });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(404).send({ message: error.message });
    }
    throw error;
  }
}
