import { Customer } from '@prisma/client';
import { CustomersRepository } from '../../repositories/customers-repository';

interface GetCustomerUseCaseRequest {
  id: string;
}

interface GetCustomerUseCaseResponse {
  customer: Customer;
}

export class GetCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({ id }: GetCustomerUseCaseRequest): Promise<GetCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found.');
    }

    return {
      customer,
    };
  }
}
