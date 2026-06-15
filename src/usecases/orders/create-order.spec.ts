import { expect, describe, it, beforeEach } from 'vitest';
import { CreateOrderUseCase } from './create-order';
import { InMemoryOrdersRepository } from '../../repositories/in-memory/in-memory-orders-repository';
import { InMemoryProductsRepository } from '../../repositories/in-memory/in-memory-products-repository';
import { Prisma } from '@prisma/client';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';
import { InsufficientStockError } from '../errors/insufficient-stock-error';

let productsRepository: InMemoryProductsRepository;
let ordersRepository: InMemoryOrdersRepository;
let sut: CreateOrderUseCase;

describe('Create Order Use Case', () => {
  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    ordersRepository = new InMemoryOrdersRepository(productsRepository);
    sut = new CreateOrderUseCase(ordersRepository);
  });

  it('should be able to create an order', async () => {
    const product = await productsRepository.create({
      name: 'Product 1',
      price: new Prisma.Decimal(10.5),
      stockQuantity: 10,
    });

    const { order } = await sut.execute({
      customerId: 'customer-1',
      items: [
        {
          productId: product.id,
          quantity: 2,
        },
      ],
    });

    expect(order.id).toEqual(expect.any(String));
    expect(order.totalAmount).toEqual(new Prisma.Decimal(21));
    expect(productsRepository.items[0].stockQuantity).toEqual(8);
  });

  it('should aggregate duplicate items correctly', async () => {
    const product = await productsRepository.create({
      name: 'Product 1',
      price: new Prisma.Decimal(10.0),
      stockQuantity: 10,
    });

    const { order } = await sut.execute({
      customerId: 'customer-1',
      items: [
        { productId: product.id, quantity: 2 },
        { productId: product.id, quantity: 3 }, // Should sum up to 5
      ],
    });

    expect(order.totalAmount).toEqual(new Prisma.Decimal(50));
    expect(productsRepository.items[0].stockQuantity).toEqual(5);
  });

  it('should not be able to create an order with empty items', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        items: [],
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it('should not be able to create an order with non-existent product', async () => {
    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        items: [{ productId: 'invalid-id', quantity: 1 }],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to create an order with insufficient stock', async () => {
    const product = await productsRepository.create({
      name: 'Product 1',
      price: new Prisma.Decimal(10.5),
      stockQuantity: 5,
    });

    await expect(() =>
      sut.execute({
        customerId: 'customer-1',
        items: [{ productId: product.id, quantity: 10 }],
      })
    ).rejects.toBeInstanceOf(InsufficientStockError);
  });
});
