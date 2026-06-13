import { FastifyInstance } from 'fastify';
import { createCustomer } from '../controllers/customers/create-customer';

export async function customersRoutes(app: FastifyInstance) {
  app.post('/', createCustomer);
}
