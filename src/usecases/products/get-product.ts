import { Product } from '@prisma/client';
import { ProductsRepository } from '../../repositories/products-repository';

interface GetProductUseCaseRequest {
  id: string;
}

interface GetProductUseCaseResponse {
  product: Product;
}

export class GetProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ id }: GetProductUseCaseRequest): Promise<GetProductUseCaseResponse> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new Error('Product not found.');
    }

    return {
      product,
    };
  }
}
