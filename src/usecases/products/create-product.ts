import { Product } from '@prisma/client';
import { ProductsRepository } from '../../repositories/products-repository';

interface CreateProductUseCaseRequest {
  name: string;
  price: number;
  stockQuantity: number;
}

interface CreateProductUseCaseResponse {
  product: Product;
}

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    price,
    stockQuantity,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = await this.productsRepository.create({
      name,
      price,
      stockQuantity,
    });

    return {
      product,
    };
  }
}
