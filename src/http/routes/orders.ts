import { FastifyInstance } from 'fastify';
import { createOrder } from '../controllers/orders/create-order';

export async function ordersRoutes(app: FastifyInstance) {
  app.post('/', createOrder);
}
