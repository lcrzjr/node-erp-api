import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { PrismaCustomersRepository } from '../../../repositories/prisma/prisma-customers-repository';
import { CreateCustomerUseCase } from '../../../usecases/customers/create-customer';

export async function createCustomer(request: FastifyRequest, reply: FastifyReply) {
  const createCustomerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    document: z.string(),
  });

  const { name, email, document } = createCustomerBodySchema.parse(request.body);

  const customersRepository = new PrismaCustomersRepository();
  const createCustomerUseCase = new CreateCustomerUseCase(customersRepository);

  const { customer } = await createCustomerUseCase.execute({
    name,
    email,
    document,
  });

  return reply.status(201).send({ customer });
}
