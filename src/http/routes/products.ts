import { FastifyInstance } from 'fastify';
import { createProduct } from '../controllers/products/create-product';
import { fetchProducts } from '../controllers/products/fetch-products';
import { getProduct } from '../controllers/products/get-product';

export async function productsRoutes(app: FastifyInstance) {
  app.post('/', createProduct);
  app.get('/', fetchProducts);
  app.get('/:id', getProduct);
}
