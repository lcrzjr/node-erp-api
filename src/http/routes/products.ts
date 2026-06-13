import { FastifyInstance } from 'fastify';
import { createProduct } from '../controllers/products/create-product';

export async function productsRoutes(app: FastifyInstance) {
  app.post('/', createProduct);
}
