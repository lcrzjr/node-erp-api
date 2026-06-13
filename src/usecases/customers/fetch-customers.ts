import { Customer } from '@prisma/client';
import { CustomersRepository } from '../../repositories/customers-repository';

interface FetchCustomersUseCaseRequest {
  page: number;
}

interface FetchCustomersUseCaseResponse {
  customers: Customer[];
}

export class FetchCustomersUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({ page }: FetchCustomersUseCaseRequest): Promise<FetchCustomersUseCaseResponse> {
    const customers = await this.customersRepository.findMany(page);

    return {
      customers,
    };
  }
}
