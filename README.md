# Confectionery Orders API

API REST para organizar clientes e encomendas de uma confeitaria. A aplicação permite cadastrar clientes e acompanhar encomendas relacionadas a eles, com dados persistidos em PostgreSQL (incluindo projetos Supabase).

## Identificação

- **Estudante:** Carlos Bueno Barroso de Oliveira

## Tecnologias

- Node.js 22+
- TypeScript
- Express
- PostgreSQL / Supabase
- `pg` para acesso ao banco
- Zod para validação
- Git

## Entidades e relacionamento

| Entidade | Atributos principais |
|---|---|
| Customer (cliente) | `id` (UUID), `name`, `phone`, `email`, `created_at`, `updated_at` |
| Order (encomenda) | `id` (UUID), `customer_id`, `title`, `description`, `occasion`, `delivery_date`, `total_price`, `status`, `created_at`, `updated_at` |
| Category (categoria) | `id` (UUID), `name`, `description`, `created_at`, `updated_at` |
| Product (produto) | `id` (UUID), `category_id`, `name`, `description`, `price`, `created_at`, `updated_at` |

Um cliente pode ter várias encomendas. Cada encomenda pertence a um cliente por meio da chave estrangeira `orders.customer_id`, que referencia `customers.id`. A exclusão de um cliente com encomendas é impedida para preservar a integridade dos dados.

Cada produto pertence a uma categoria por meio de `products.category_id`, que referencia `categories.id`. A exclusão de uma categoria que possui produtos é impedida.

## Estrutura do projeto

```text
src/
├── config/        # Conexão com PostgreSQL
├── controllers/   # Tratamento das requisições e respostas
├── errors/        # Erros da aplicação
├── middlewares/   # Tratamento assíncrono e erros HTTP
├── models/        # Classes das entidades e DTOs
├── repositories/  # Consultas e persistência no banco
├── routes/        # Rotas HTTP
├── validators/    # Validação dos dados recebidos
├── app.ts         # Configuração do Express
└── server.ts      # Inicialização e encerramento do servidor

database/
├── create_tables.sql  # Esquema completo para uma instalação nova
└── migrations/        # Migrações para bancos já existentes
tests/                 # Testes automatizados da API
```

## Configuração e execução

Pré-requisitos: Node.js 22+, npm e um banco PostgreSQL ou projeto Supabase.

```bash
git clone https://github.com/cbboliveira07-beep/confectionery-orders-api.git
cd confectionery-orders-api
npm install
```

Copie `.env.example` para `.env` e preencha a URL de conexão do seu banco:

```bash
cp .env.example .env
```

No Windows PowerShell, use `Copy-Item .env.example .env`. No Supabase, execute `database/create_tables.sql` pelo SQL Editor para um banco novo. Se o banco já tiver `customers` e `orders`, execute `database/migrations/002_categories_products.sql` para adicionar categorias e produtos. Depois:

```bash
npm run dev
```

A API inicia em `http://localhost:3000`. Para compilar e iniciar a versão compilada, use `npm run build` e `npm start`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `PORT` | Não | Porta HTTP; padrão `3000` |
| `DATABASE_URL` | Sim | URL de conexão PostgreSQL/Supabase |
| `PGSSLROOTCERT` | Não | Caminho para certificado raiz, quando exigido pela configuração TLS |

`.env.example` contém apenas valores ilustrativos. O arquivo `.env` com credenciais reais está excluído pelo `.gitignore` e não deve ser enviado ao repositório.

## Banco de dados

O esquema cria `customers`, `orders`, `categories` e `products` com UUID como chave primária e restrições de integridade. `orders.customer_id` referencia `customers.id`; `products.category_id` referencia `categories.id`. Status, ocasião e preços têm restrições. Gatilhos atualizam `updated_at` automaticamente. Row Level Security (RLS) fica habilitado nas tabelas; configure políticas no Supabase conforme a forma de acesso adotada.

## Endpoints

Todas as respostas e corpos de requisição usam JSON, exceto exclusões bem-sucedidas, que retornam `204` sem corpo. IDs de rota devem ser UUIDs.

| Método | Endpoint | Finalidade |
|---|---|---|
| GET | `/` | Informações básicas da API |
| GET | `/health` | Verifica disponibilidade HTTP |
| GET | `/customers` | Lista clientes |
| GET | `/customers/:id` | Consulta cliente por UUID |
| POST | `/customers` | Cria cliente |
| PUT | `/customers/:id` | Atualiza um ou mais campos do cliente |
| DELETE | `/customers/:id` | Exclui cliente sem encomendas |
| GET | `/customers/:id/orders` | Lista encomendas do cliente |
| GET | `/categories` | Lista categorias |
| GET | `/categories?search=bolo` | Pesquisa categorias por nome ou descrição |
| GET | `/categories/:id` | Consulta categoria por UUID |
| POST | `/categories` | Cria categoria |
| PUT | `/categories/:id` | Atualiza categoria |
| DELETE | `/categories/:id` | Exclui categoria sem produtos |
| GET | `/categories/:id/products` | Lista produtos da categoria |
| GET | `/products` | Lista produtos |
| GET | `/products?search=chocolate` | Pesquisa produtos por nome ou descrição |
| GET | `/products/:id` | Consulta produto por UUID |
| POST | `/products` | Cria produto vinculado a uma categoria |
| PUT | `/products/:id` | Atualiza produto |
| DELETE | `/products/:id` | Exclui produto |
| GET | `/orders` | Lista encomendas |
| GET | `/orders/:id` | Consulta encomenda por UUID |
| POST | `/orders` | Cria encomenda vinculada a cliente existente |
| PUT | `/orders/:id` | Atualiza um ou mais campos da encomenda |
| DELETE | `/orders/:id` | Exclui encomenda |

Erros de validação retornam `400`, registros inexistentes retornam `404`, tentativas de excluir cliente com encomendas ou categoria com produtos retornam `409`, criações retornam `201` e exclusões concluídas retornam `204`.

## Exemplos de requisição

Criar categoria (`POST /categories`):

```json
{
  "name": "Bolos",
  "description": "Bolos para festas e encomendas personalizadas"
}
```

Pesquisas não diferenciam maiúsculas de minúsculas e retornam uma lista vazia quando não há correspondências. O parâmetro `search` aceita até 100 caracteres.

Criar produto (`POST /products`):

```json
{
  "category_id": "UUID_DA_CATEGORIA",
  "name": "Bolo de chocolate",
  "description": "Bolo de chocolate para 20 pessoas",
  "price": 120.00
}
```

Atualizar produto (`PUT /products/UUID_DO_PRODUTO`):

```json
{
  "price": 135.00,
  "description": "Bolo de chocolate para 25 pessoas"
}
```

Criar cliente (`POST /customers`):

```json
{
  "name": "Mariana Souza",
  "phone": "41999999999",
  "email": "mariana@example.com"
}
```

Criar encomenda (`POST /orders`):

```json
{
  "customer_id": "UUID_DO_CLIENTE",
  "title": "Bolo de aniversário",
  "description": "Bolo de chocolate para 30 pessoas",
  "occasion": "birthday",
  "delivery_date": "2026-10-25T15:00:00-03:00",
  "total_price": 280,
  "status": "pending"
}
```

Atualizar encomenda (`PUT /orders/UUID_DA_ENCOMENDA`):

```json
{
  "status": "confirmed",
  "total_price": 300
}
```

Campos opcionais de criação incluem `email`, `description`, `occasion` e `status`. Em atualizações, envie pelo menos um campo permitido. Datas devem estar no formato ISO 8601 com fuso horário; preço deve ser número não negativo com até duas casas decimais.

Valores aceitos para `occasion`: `birthday`, `wedding`, `party`, `corporate`, `other`. Valores aceitos para `status`: `pending`, `confirmed`, `in_production`, `ready`, `delivered`, `cancelled`.

## Comandos disponíveis

```text
npm run dev       inicia em modo de desenvolvimento
npm run build     compila o TypeScript
npm start         inicia a versão compilada
npm run typecheck verifica os tipos
npm test          compila e executa os testes automatizados
```
