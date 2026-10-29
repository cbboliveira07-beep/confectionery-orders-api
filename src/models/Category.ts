export interface CategoryRecord {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export class Category {
  constructor(
    private readonly categoryId: string,
    private readonly categoryName: string,
    private readonly categoryDescription: string | null,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  get id(): string { return this.categoryId; }
  get name(): string { return this.categoryName; }
  get description(): string | null { return this.categoryDescription; }
  get created_at(): Date { return this.createdAt; }
  get updated_at(): Date { return this.updatedAt; }

  toJSON(): CategoryRecord {
    return {
      id: this.categoryId,
      name: this.categoryName,
      description: this.categoryDescription,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

export type CreateCategoryDTO = Pick<Category, "name"> & { description?: string | null };
export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;
