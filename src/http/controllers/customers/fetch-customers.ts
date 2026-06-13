import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCustomersRepository } from '../../../repositories/prisma/prisma-customers-repository';
import { FetchCustomersUseCase } from '../../../usecases/customers/fetch-customers';

export async function fetchCustomers(request: FastifyRequest, reply: FastifyReply) {
  const fetchCustomersQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = fetchCustomersQuerySchema.parse(request.query);

  const customersRepository = new PrismaCustomersRepository();
  const fetchCustomersUseCase = new FetchCustomersUseCase(customersRepository);

  const { customers } = await fetchCustomersUseCase.execute({
    page,
  });

  return reply.status(200).send({ customers });
}
