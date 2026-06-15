import { app } from '../../../app';
import { prisma } from '../../../lib/prisma';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { expect, describe, it, beforeAll, afterAll } from 'vitest';

describe('Create Customer (E2E)', () => {
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15-alpine').start();
    process.env.DATABASE_URL = container.getConnectionUri();

    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });

    await app.ready();
  }, 60000);

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
    if (container) {
      await container.stop();
    }
  });

  it('should be able to create a customer', async () => {
    const randomSuffix = Math.random().toString(36).substring(7);
    const response = await app.inject({
      method: 'POST',
      url: '/customers',
      payload: {
        name: 'Jane Doe',
        email: `jane-${randomSuffix}@example.com`,
        document: `98765${randomSuffix}`,
      },
    });

    expect(response.statusCode).toEqual(201);
  });
});
