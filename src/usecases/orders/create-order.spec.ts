import { expect, describe, it, beforeEach } from 'vitest';
import { CreateOrderUseCase } from './create-order';
import { InMemoryOrdersRepository } from '../../repositories/in-memory/in-memory-orders-repository';
import { InMemoryProductsRepository } from '../../repositories/in-memory/in-memory-products-repository';
import { InMemoryCustomersRepository } from '../../repositories/in-memory/in-memory-customers-repository';
import { Prisma } from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InsufficientStockError } from '../errors/insufficient-stock-error';

let productsRepository: InMemoryProductsRepository;
let customersRepository: InMemoryCustomersRepository;
let ordersRepository: InMemoryOrdersRepository;
let sut: CreateOrderUseCase;

describe('Create Order Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    customersRepository = new InMemoryCustomersRepository();
    ordersRepository = new InMemoryOrdersRepository(productsRepository, customersRepository);
    sut = new CreateOrderUseCase(ordersRepository);
  });

  it('should be able to create an order', async () => {
    const customer = await customersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      document: '12345678900',
    });

    const product = await productsRepository.create({
      name: 'Product 1',
      price: new Prisma.Decimal(10.5),
      stockQuantity: 10,
    });

    const { order } = await sut.execute({
      customerId: customer.id,
      items: [
        {
          productId: product.id,
          quantity: 2,
        },
      ],
    });

    expect(order.id).toEqual(expect.any(String));
    expect(order.totalAmount).toEqual(new Prisma.Decimal(21));
    expect(productsRepository.items[0]?.stockQuantity).toEqual(8);
  });

  it('should aggregate duplicate items correctly', async () => {
    const customer = await customersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      document: '12345678900',
    });

    const product = await productsRepository.create({
      name: 'Product 1',
      price: new Prisma.Decimal(10.0),
      stockQuantity: 10,
    });

    const { order } = await sut.execute({
      customerId: customer.id,
      items: [
        { productId: product.id, quantity: 2 },
        { productId: product.id, quantity: 3 }, // Should sum up to 5
      ],
    });

    expect(order.totalAmount).toEqual(new Prisma.Decimal(50));
    expect(productsRepository.items[0]?.stockQuantity).toEqual(5);
  });

  it('should not be able to create an order with empty items', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        items: [],
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create an order with non-existent customer', async () => {
    const product = await productsRepository.create({
      name: 'Product 1',
      price: new Prisma.Decimal(10.5),
      stockQuantity: 10,
    });

    await expect(() =>
      sut.execute({
        customerId: 'invalid-customer-id',
        items: [{ productId: product.id, quantity: 1 }],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to create an order with non-existent product', async () => {
    const customer = await customersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      document: '12345678900',
    });

    await expect(() =>
      sut.execute({
        customerId: customer.id,
        items: [{ productId: 'invalid-id', quantity: 1 }],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to create an order with insufficient stock', async () => {
    const customer = await customersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      document: '12345678900',
    });

    const product = await productsRepository.create({
      name: 'Product 1',
      price: new Prisma.Decimal(10.5),
      stockQuantity: 5,
    });

    await expect(() =>
      sut.execute({
        customerId: customer.id,
        items: [{ productId: product.id, quantity: 10 }],
      })
    ).rejects.toBeInstanceOf(InsufficientStockError);
  });

  it('should rollback and not partial-deduct stock if any item fails', async () => {
    const customer = await customersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      document: '12345678900',
    });

    const product1 = await productsRepository.create({
      name: 'Product 1',
      price: new Prisma.Decimal(10.0),
      stockQuantity: 10,
    });

    const product2 = await productsRepository.create({
      name: 'Product 2',
      price: new Prisma.Decimal(20.0),
      stockQuantity: 2, // Only 2 in stock
    });

    await expect(() =>
      sut.execute({
        customerId: customer.id,
        items: [
          { productId: product1.id, quantity: 5 }, // Valid
          { productId: product2.id, quantity: 5 }, // Invalid (Insufficient stock)
        ],
      })
    ).rejects.toBeInstanceOf(InsufficientStockError);

    // Rollback validation: Product 1 should NOT be deducted
    expect(productsRepository.items[0]?.stockQuantity).toEqual(10);
    expect(productsRepository.items[1]?.stockQuantity).toEqual(2);
  });
});
