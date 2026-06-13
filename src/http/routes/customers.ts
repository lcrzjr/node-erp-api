import { FastifyInstance } from 'fastify';
import { createCustomer } from '../controllers/customers/create-customer';
import { fetchCustomers } from '../controllers/customers/fetch-customers';
import { getCustomer } from '../controllers/customers/get-customer';

export async function customersRoutes(app: FastifyInstance) {
  app.post('/', createCustomer);
  app.get('/', fetchCustomers);
  app.get('/:id', getCustomer);
}
