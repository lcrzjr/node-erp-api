import { expect, describe, it, beforeEach } from 'vitest';
import { CreateCustomerUseCase } from './create-customer';
import { InMemoryCustomersRepository } from '../../repositories/in-memory/in-memory-customers-repository';
import { ConflictError } from '../errors/conflict-error';

let customersRepository: InMemoryCustomersRepository;
let sut: CreateCustomerUseCase;

describe('Create Customer Use Case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository();
    sut = new CreateCustomerUseCase(customersRepository);
  });

  it('should be able to create a customer', async () => {
    const { customer } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      document: '12345678900',
    });

    expect(customer.id).toEqual(expect.any(String));
  });

  it('should not be able to create a customer with same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      document: '12345678900',
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe 2',
        email: 'johndoe@example.com',
        document: '00987654321',
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it('should not be able to create a customer with same document twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      document: '12345678900',
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe 2',
        email: 'john2@example.com',
        document: '12345678900',
      })
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
