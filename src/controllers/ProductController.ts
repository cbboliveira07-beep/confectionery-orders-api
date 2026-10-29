import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { keywordSchema, productSchema, productUpdateSchema, uuidSchema } from "../validators/schemas";

export class ProductController {
  private readonly repository = new ProductRepository();
  private readonly categories = new CategoryRepository();

  list = async (_req: Request, res: Response): Promise<void> => {
    const search = keywordSchema.parse(_req.query.search);
    res.json(await this.repository.findAll(search));
  };

  get = async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    const product = await this.repository.findById(id);
    if (!product) throw new AppError(404, "Produto não encontrado.");
    res.json(product);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const data = productSchema.parse(req.body);
    if (!await this.categories.findById(data.category_id)) {
      throw new AppError(404, "Categoria não encontrada.");
    }
    const product = await this.repository.create(data);
    res.location(`/products/${product.id}`).status(201).json(product);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    const data = productUpdateSchema.parse(req.body);
    if (!await this.repository.findById(id)) throw new AppError(404, "Produto não encontrado.");
    if (data.category_id && !await this.categories.findById(data.category_id)) {
      throw new AppError(404, "Categoria não encontrada.");
    }
    const product = await this.repository.update(id, data);
    if (!product) throw new AppError(404, "Produto não encontrado.");
    res.json(product);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = uuidSchema.parse(req.params.id);
    if (!await this.repository.findById(id)) throw new AppError(404, "Produto não encontrado.");
    if (!await this.repository.delete(id)) throw new AppError(404, "Produto não encontrado.");
    res.status(204).send();
  };
}
