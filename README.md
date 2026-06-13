# Node ERP API (Migração de Delphi -> Node.js)

Este projeto foi construído para demonstrar conceitos avançados de arquitetura backend e banco de dados relacional com Node.js e TypeScript, aplicando padrões comuns no desenvolvimento de ERPs e sistemas corporativos.

## Funcionalidades Principais
- **Transações ACID (Controle de Estoque e Vendas):** A principal funcionalidade (`CreateOrderUseCase`) demonstra o uso de transações no banco de dados. Ao criar um pedido, o estoque dos produtos é deduzido na mesma transação. Se houver falha, o banco realiza um `rollback`, garantindo a integridade dos dados (exatamente como em sistemas críticos corporativos e PDVs construídos em Delphi/PostgreSQL).
- **Arquitetura Limpa:** Padrão Repository e UseCases, separando totalmente a regra de negócio do acesso ao banco de dados ou framework web.

## Stack Tecnológica
- **Linguagem:** TypeScript
- **Web Framework:** Fastify (Alta performance)
- **Banco de Dados:** PostgreSQL (via Docker)
- **ORM:** Prisma
- **Validação de Dados:** Zod

## Como rodar o projeto

1. Certifique-se de ter o Docker e Docker Compose instalados.
2. Na raiz do projeto, suba o banco de dados:
```bash
docker-compose up -d
```
3. Instale as dependências:
```bash
npm install
```
4. Rode as migrations do banco de dados:
```bash
npx prisma migrate dev
```
5. Inicie o servidor:
```bash
npm run dev
```

O servidor estará rodando na porta 3333.
