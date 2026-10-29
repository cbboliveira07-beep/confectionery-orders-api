import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { categorySchema, categoryUpdateSchema, uuidSchema } from "../validators/schemas";

export class CategoryController {
  private readonly repository = new CategoryRepository();
  private readonly products = new ProductRepository();

  list = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.repository.findAll());
  };

  get = async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    const category = await this.repository.findById(id);
    if (!category) throw new AppError(404, "Categoria não encontrada.");
    res.json(category);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data = categorySchema.parse(req.body);
    const category = await this.repository.create(data);
    res.location(`/categories/${category.id}`).status(201).json(category);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    const data = categoryUpdateSchema.parse(req.body);
    if (!await this.repository.findById(id)) throw new AppError(404, "Categoria não encontrada.");
    const category = await this.repository.update(id, data);
    if (!category) throw new AppError(404, "Categoria não encontrada.");
    res.json(category);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    if (!await this.repository.findById(id)) throw new AppError(404, "Categoria não encontrada.");
    if (await this.repository.hasProducts(id)) {
      throw new AppError(409, "Não é possível excluir uma categoria que possui produtos.");
    }
    if (!await this.repository.delete(id)) throw new AppError(404, "Categoria não encontrada.");
    res.status(204).send();
  };

  listProducts = async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    if (!await this.repository.findById(id)) throw new AppError(404, "Categoria não encontrada.");
    res.json(await this.products.findByCategoryId(id));
  };
}
