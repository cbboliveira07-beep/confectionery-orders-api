export interface ProductRecord {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export class Product {
  constructor(
    private readonly productId: string,
    private readonly categoryId: string,
    private readonly productName: string,
    private readonly productDescription: string | null,
    private readonly productPrice: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  get id(): string { return this.productId; }
  get category_id(): string { return this.categoryId; }
  get name(): string { return this.productName; }
  get description(): string | null { return this.productDescription; }
  get price(): number { return this.productPrice; }
  get created_at(): Date { return this.createdAt; }
  get updated_at(): Date { return this.updatedAt; }

  toJSON(): ProductRecord {
    return {
      id: this.productId,
      category_id: this.categoryId,
      name: this.productName,
      description: this.productDescription,
      price: this.productPrice,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

export type CreateProductDTO = Pick<Product, "category_id" | "name" | "price"> & {
  description?: string | null;
};
export type UpdateProductDTO = Partial<CreateProductDTO>;
