import fastify from 'fastify';
import { ZodError } from 'zod';
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

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
