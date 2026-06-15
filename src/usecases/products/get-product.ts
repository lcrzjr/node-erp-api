import { Product } from '@prisma/client';
import { ProductsRepository } from '../../repositories/products-repository';
import { ResourceNotFoundError } from '../errors/resource-not-found-error';

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
      throw new ResourceNotFoundError('Product not found.');
    }

    return {
      product,
    };
  }
}
