import { FastifyInstance } from 'fastify';
import { createOrder } from '../controllers/orders/create-order';
import { fetchOrders } from '../controllers/orders/fetch-orders';
import { getOrder } from '../controllers/orders/get-order';

export async function ordersRoutes(app: FastifyInstance) {
  app.post('/', createOrder);
  app.get('/', fetchOrders);
  app.get('/:id', getOrder);
}
