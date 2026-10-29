import { database } from "../config/database";
import { AppError } from "../errors/AppError";
import { Category, CategoryRecord, CreateCategoryDTO, UpdateCategoryDTO } from "../models/Category";

const toCategory = (record: CategoryRecord): Category => new Category(
  record.id, record.name, record.description, record.created_at, record.updated_at,
);

export class CategoryRepository {
  async findAll(search?: string): Promise<Category[]> {
    const result = search
      ? await database.query<CategoryRecord>(
        "select * from categories where name ilike $1 or coalesce(description, '') ilike $1 order by name, id",
        [`%${search}%`],
      )
      : await database.query<CategoryRecord>("select * from categories order by name, id");
    const records = result.rows;
    return records.map(toCategory);
  }

  async findById(id: string): Promise<Category | undefined> {
    const record = (await database.query<CategoryRecord>(
      "select * from categories where id = $1", [id],
    )).rows[0];
    return record ? toCategory(record) : undefined;
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    const record = (await database.query<CategoryRecord>(
      "insert into categories (name, description) values ($1, $2) returning *",
      [data.name, data.description ?? null],
    )).rows[0];
    return toCategory(record);
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<Category | undefined> {
    const keys = (["name", "description"] as const).filter(key => data[key] !== undefined);
    if (!keys.length) throw new AppError(400, "Informe ao menos um campo.");
    const record = (await database.query<CategoryRecord>(
      `update categories set ${keys.map((key, index) => `${key} = $${index + 2}`).join(", ")} where id = $1 returning *`,
      [id, ...keys.map(key => data[key])],
    )).rows[0];
    return record ? toCategory(record) : undefined;
  }

  async hasProducts(id: string): Promise<boolean> {
    const result = await database.query<{ exists: boolean }>(
      "select exists(select 1 from products where category_id = $1)", [id],
    );
    return result.rows[0].exists;
  }

  async delete(id: string): Promise<boolean> {
    try {
      return (await database.query("delete from categories where id = $1", [id])).rowCount === 1;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "23503") {
        throw new AppError(409, "Não é possível excluir uma categoria que possui produtos.");
      }
      throw error;
    }
  }
}
