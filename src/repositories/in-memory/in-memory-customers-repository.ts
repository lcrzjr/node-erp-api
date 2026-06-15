import { Customer, Prisma } from '@prisma/client';
import { CustomersRepository } from '../customers-repository';
import { randomUUID } from 'crypto';

export class InMemoryCustomersRepository implements CustomersRepository {
  public items: Customer[] = [];

  async create(data: Prisma.CustomerCreateInput) {
    const customer = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      document: data.document,
      createdAt: new Date(),
    };

    this.items.push(customer);

    return customer;
  }

  async findByEmail(email: string) {
    const customer = this.items.find((item) => item.email === email);
    return customer || null;
  }

  async findByDocument(document: string) {
    const customer = this.items.find((item) => item.document === document);
    return customer || null;
  }

  async findById(id: string) {
    const customer = this.items.find((item) => item.id === id);
    return customer || null;
  }

  async findMany(page: number) {
    return this.items.slice((page - 1) * 20, page * 20);
  }
}
