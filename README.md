# Node.js ERP & POS API

<div align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Fastify" src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
</div>

<br/>

> **Português:** Este projeto foi desenvolvido para demonstrar a aplicação de conceitos corporativos críticos (frequentemente vistos em sistemas ERPs feitos em Delphi/Java) dentro do ecossistema moderno do Node.js, focando em integridade de dados e arquitetura escalável.

> **English:** This project was developed to demonstrate the application of critical enterprise concepts (often seen in ERP systems built with Delphi/Java) within the modern Node.js ecosystem, focusing on data integrity and scalable architecture.

## Highlights & Features

1. **ACID Transactions & Atomic Concurrency:** 
   - The core functionality (`CreateOrderUseCase`) demonstrates database transactions. When an order is placed, the product stock is deducted within the same transaction using atomic `updateMany` operations to prevent race conditions, guaranteeing data integrity just like critical POS/ERP systems. It also aggregates duplicate items dynamically.
2. **Precision Calculations:**
   - Financial calculations strictly use `Prisma.Decimal` end-to-end to prevent float-point rounding errors common in JavaScript `Number`.
3. **Testing (Unit & E2E):**
   - **Vitest** configured as the main test runner.
   - Comprehensive **Unit Tests** utilizing the In-Memory Repository pattern.
   - **Integration (E2E) Tests** using **Testcontainers** to dynamically provision isolated PostgreSQL databases for testing real database constraints.
4. **Clean Architecture & SOLID:** 
   - Implemented the **Repository Pattern** and **Use Cases**. The business logic is completely isolated from the database (Prisma) and the web framework (Fastify).
5. **Strict Validation:** 
   - All incoming HTTP requests are strictly validated using **Zod** before reaching the controllers.
6. **Centralized Error Handling:**
   - Custom Domain Errors (e.g., `ResourceNotFoundError`, `ConflictError`, `InsufficientStockError`) intercepted by a global Fastify error handler, returning standardized HTTP responses.

## Technologies

- **Node.js** + **TypeScript**
- **Fastify** (High-performance web framework)
- **PostgreSQL** (Relational Database via Docker)
- **Prisma** (Next-generation ORM)
- **Zod** (Schema validation)

## How to Run

1. Clone this repository.
2. Ensure you have **Docker** and **Docker Compose** installed.
3. Start the database container:
   ```bash
   docker-compose up -d
   ```
4. Install the dependencies:
   ```bash
   npm install
   ```
5. Run the database migrations to create the tables:
   ```bash
   npx prisma migrate dev
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3333`.

## Project Structure

```text
src/
 ├── env/              # Environment variables validation
 ├── http/
 │   ├── controllers/  # Fastify route handlers
 │   └── routes/       # API endpoints definition
 ├── lib/              # Third-party library setups (Prisma)
 ├── repositories/     # Data access interfaces and Prisma implementations
 └── usecases/         # Core business logic and rules
```

## API Endpoints

Below are the main routes available in the system:

### Customers
- `POST /customers` - Registers a new customer.
- `GET /customers` - Lists all customers (paginated).
- `GET /customers/:id` - Retrieves details of a specific customer.

### Products
- `POST /products` - Registers a new product.
- `GET /products` - Lists all available products (paginated).
- `GET /products/:id` - Retrieves details of a specific product.

### Orders
- `POST /orders` - Creates a new sales order and deduct stock inside an ACID transaction.
- `GET /orders` - Lists all orders (paginated).
- `GET /orders/:id` - Retrieves details of a specific order (includes relational data like customer and items).
