import { Customer } from '@prisma/client';
import { CustomersRepository } from '../../repositories/customers-repository';

interface CreateCustomerUseCaseRequest {
  name: string;
  email: string;
  document: string;
}

interface CreateCustomerUseCaseResponse {
  customer: Customer;
}

export class CreateCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    name,
    email,
    document,
  }: CreateCustomerUseCaseRequest): Promise<CreateCustomerUseCaseResponse> {
    const customerWithSameEmail = await this.customersRepository.findByEmail(email);

    if (customerWithSameEmail) {
      throw new Error('Customer with same email already exists.');
    }

    const customerWithSameDocument = await this.customersRepository.findByDocument(document);

    if (customerWithSameDocument) {
      throw new Error('Customer with same document already exists.');
    }

    const customer = await this.customersRepository.create({
      name,
      email,
      document,
    });

    return {
      customer,
    };
  }
}
