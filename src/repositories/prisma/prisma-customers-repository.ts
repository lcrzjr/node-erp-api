import { prisma } from '../../lib/prisma';
import { Prisma } from '@prisma/client';
import { CustomersRepository } from '../customers-repository';

export class PrismaCustomersRepository implements CustomersRepository {
  async create(data: Prisma.CustomerCreateInput) {
    const customer = await prisma.customer.create({
      data,
    });
    return customer;
  }

  async findByEmail(email: string) {
    const customer = await prisma.customer.findUnique({
      where: {
        email,
      },
    });
    return customer;
  }

  async findByDocument(document: string) {
    const customer = await prisma.customer.findUnique({
      where: {
        document,
      },
    });
    return customer;
  }
}
