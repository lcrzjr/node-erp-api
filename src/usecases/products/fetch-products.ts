import { Product } from '@prisma/client';
import { ProductsRepository } from '../../repositories/products-repository';

interface FetchProductsUseCaseRequest {
  page: number;
}

interface FetchProductsUseCaseResponse {
  products: Product[];
}

export class FetchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ page }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productsRepository.findMany(page);

    return {
      products,
    };
  }
}
