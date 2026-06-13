import { Customer, Prisma } from '@prisma/client';

export interface CustomersRepository {
  create(data: Prisma.CustomerCreateInput): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | null>;
  findByDocument(document: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
  findMany(page: number): Promise<Customer[]>;
}
