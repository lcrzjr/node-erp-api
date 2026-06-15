import fastify from 'fastify';
import { ZodError } from 'zod';
import { ResourceNotFoundError } from './usecases/errors/resource-not-found-error';
import { InsufficientStockError } from './usecases/errors/insufficient-stock-error';
import { ConflictError } from './usecases/errors/conflict-error';
import { customersRoutes } from './http/routes/customers';
import { productsRoutes } from './http/routes/products';
import { ordersRoutes } from './http/routes/orders';
import { env } from './env';

export const app = fastify();

app.register(customersRoutes, { prefix: '/customers' });
app.register(productsRoutes, { prefix: '/products' });
app.register(ordersRoutes, { prefix: '/orders' });


app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    });
  }

  if (error instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: error.message });
  }

  if (error instanceof InsufficientStockError || error instanceof ConflictError) {
    return reply.status(409).send({ message: error.message });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
