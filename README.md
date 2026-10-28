# CRUD de Produtos e Categorias

API REST feita com **Node.js**, **Express 5** e **Prisma** (PostgreSQL) para gerenciar produtos e suas categorias.

## Tecnologias

- Node.js **22.18 ou superior** (ES Modules). O `src/lib/prisma.js` importa um arquivo `.ts`, que só roda direto em versões recentes do Node
- Express 5
- Prisma ORM 7 + `@prisma/adapter-pg`
- PostgreSQL

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo .env na raiz com a conexão do banco
#    DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"

# 3. Gerar o client do Prisma e aplicar as migrations
npx prisma generate
npx prisma migrate deploy

# 4. (Opcional) Popular o banco com categorias e produtos de exemplo
npm run seed

# 5. Iniciar o servidor
npm run dev     # modo watch
npm start       # modo normal
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

## Modelos

### Categoria

| Campo      | Tipo      | Observações        |
| ---------- | --------- | ------------------ |
| `id`       | Int       | PK, autoincremento |
| `nome`     | String    | Único              |
| `produtos` | Produto[] | Relação 1:N        |

### Produto

| Campo         | Tipo   | Observações                |
| ------------- | ------ | -------------------------- |
| `id`          | Int    | PK, autoincremento         |
| `nome`        | String | Único                      |
| `preco`       | Float  |                            |
| `categoriaId` | Int    | FK para `Categoria.id`     |

## Rotas

Resumo:

| Método   | Rota              | Descrição                                  |
| -------- | ----------------- | ------------------------------------------ |
| `GET`    | `/categorias`     | Lista todas as categorias                  |
| `GET`    | `/categorias/:id` | Busca uma categoria por id                 |
| `POST`   | `/categorias`     | Cria uma categoria                         |
| `DELETE` | `/categorias/:id` | Exclui uma categoria                       |
| `GET`    | `/produtos`       | Lista produtos (filtro opcional por preço) |
| `GET`    | `/produtos/:id`   | Busca um produto por id (com categoria)    |
| `POST`   | `/produtos`       | Cria um produto                            |
| `PUT`    | `/produtos/:id`   | Atualiza o preço de um produto             |
| `DELETE` | `/produtos/:id`   | Exclui um produto                          |

---

### Categorias

#### `GET /categorias`

Retorna todas as categorias.

**Resposta `200`**

```json
[
  { "id": 1, "nome": "Eletrônicos" },
  { "id": 2, "nome": "Livros" }
]
```

#### `GET /categorias/:id`

Retorna uma categoria pelo id.

| Status | Significado        |
| ------ | ------------------ |
| `200`  | Categoria retornada |
| `400`  | Id inválido        |
| `404`  | Id não encontrado  |

**Resposta `200`**

```json
{ "id": 1, "nome": "Eletrônicos" }
```

#### `POST /categorias`

Cria uma nova categoria.

**Body**

```json
{ "nome": "Eletrônicos" }
```

| Status | Significado                     |
| ------ | ------------------------------- |
| `201`  | Categoria criada (retorna o objeto) |
| `400`  | `nome` não informado            |
| `409`  | Já existe categoria com esse nome |

#### `DELETE /categorias/:id`

Exclui uma categoria pelo id.

| Status | Significado        |
| ------ | ------------------ |
| `200`  | Categoria excluída (retorna o objeto) |
| `400`  | Id inválido        |
| `404`  | Id não encontrado  |
| `409`  | Categoria possui produtos vinculados |

---

### Produtos

#### `GET /produtos`

Lista os produtos. Aceita filtro por faixa de preço via query string.

| Query | Tipo   | Descrição    |
| ----- | ------ | ------------ |
| `min` | number | Preço mínimo |
| `max` | number | Preço máximo |

> `min` e `max` são opcionais e podem ser usados separadamente. Valores não numéricos retornam `400`.

**Exemplos**

```
GET /produtos
GET /produtos?min=10&max=100
```

**Resposta `200`**

```json
[
  { "id": 1, "nome": "Mouse", "preco": 59.9, "categoriaId": 1 }
]
```

#### `GET /produtos/:id`

Retorna um produto pelo id, incluindo sua categoria.

| Status | Significado        |
| ------ | ------------------ |
| `200`  | Produto retornado  |
| `400`  | Id inválido        |
| `404`  | Id não encontrado  |

**Resposta `200`**

```json
{
  "id": 1,
  "nome": "Mouse",
  "preco": 59.9,
  "categoriaId": 1,
  "categoria": { "id": 1, "nome": "Eletrônicos" }
}
```

#### `POST /produtos`

Cria um novo produto.

**Body**

```json
{
  "nome": "Mouse",
  "preco": 59.9,
  "categoriaId": 1
}
```

| Campo         | Tipo   | Obrigatório | Regra                |
| ------------- | ------ | ----------- | -------------------- |
| `nome`        | string | sim         |                      |
| `preco`       | number | sim         | Número maior que 0   |
| `categoriaId` | number | sim         | Id de uma categoria  |

| Status | Significado                                  |
| ------ | -------------------------------------------- |
| `201`  | Produto criado (retorna o objeto)            |
| `400`  | Campos obrigatórios ausentes, `preco` inválido (não numérico ou <= 0) ou `categoriaId` inválido |
| `404`  | Categoria não encontrada                     |
| `409`  | Já existe produto com esse nome              |

#### `PUT /produtos/:id`

Atualiza o **preço** de um produto.

**Body**

```json
{ "preco": 79.9 }
```

| Status | Significado             |
| ------ | ----------------------- |
| `200`  | Produto atualizado (retorna o objeto) |
| `400`  | Id inválido, `preco` ausente ou inválido (deve ser número > 0) |
| `404`  | Id não encontrado       |

#### `DELETE /produtos/:id`

Exclui um produto pelo id.

| Status | Significado        |
| ------ | ------------------ |
| `200`  | Produto excluído (retorna o objeto) |
| `400`  | Id inválido        |
| `404`  | Id não encontrado  |

## Erros

Todos os erros retornam JSON no formato:

```json
{ "erro": "mensagem" }
```

Body com JSON malformado retorna `400` e falhas inesperadas retornam `500`.

## Estrutura do projeto

```
.
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── lib/prisma.js
│   └── server.js
├── prisma.config.ts
└── package.json
```
