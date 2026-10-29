import { database } from "../config/database";
import { AppError } from "../errors/AppError";
import { CreateProductDTO, Product, ProductRecord, UpdateProductDTO } from "../models/Product";

const fields = "id, category_id, name, description, price::float8 as price, created_at, updated_at";
const toProduct = (record: ProductRecord): Product => new Product(
  record.id, record.category_id, record.name, record.description, record.price,
  record.created_at, record.updated_at,
);

function rethrow(error: unknown): never {
  if (error && typeof error === "object" && "code" in error && error.code === "23503") {
    throw new AppError(404, "Categoria não encontrada.");
  }
  throw error;
}

export class ProductRepository {
  async findAll(search?: string): Promise<Product[]> {
    const result = search
      ? await database.query<ProductRecord>(
        `select ${fields} from products
         where name ilike $1 or coalesce(description, '') ilike $1 order by name, id`,
        [`%${search}%`],
      )
      : await database.query<ProductRecord>(`select ${fields} from products order by name, id`);
    const records = result.rows;
    return records.map(toProduct);
  }

  async findById(id: string): Promise<Product | undefined> {
    const record = (await database.query<ProductRecord>(
      `select ${fields} from products where id = $1`, [id],
    )).rows[0];
    return record ? toProduct(record) : undefined;
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const records = (await database.query<ProductRecord>(
      `select ${fields} from products where category_id = $1 order by name, id`, [categoryId],
    )).rows;
    return records.map(toProduct);
  }

  async create(data: CreateProductDTO): Promise<Product> {
    try {
      const record = (await database.query<ProductRecord>(
        `insert into products (category_id, name, description, price)
         values ($1, $2, $3, $4) returning ${fields}`,
        [data.category_id, data.name, data.description ?? null, data.price],
      )).rows[0];
      return toProduct(record);
    } catch (error) {
      return rethrow(error);
    }
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product | undefined> {
    const keys = (["category_id", "name", "description", "price"] as const)
      .filter(key => data[key] !== undefined);
    if (!keys.length) throw new AppError(400, "Informe ao menos um campo.");
    try {
      const record = (await database.query<ProductRecord>(
        `update products set ${keys.map((key, index) => `${key} = $${index + 2}`).join(", ")} where id = $1 returning ${fields}`,
        [id, ...keys.map(key => data[key])],
      )).rows[0];
      return record ? toProduct(record) : undefined;
    } catch (error) {
      return rethrow(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    return (await database.query("delete from products where id = $1", [id])).rowCount === 1;
  }
}
