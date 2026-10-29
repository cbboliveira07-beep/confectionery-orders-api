import { z } from "zod";
import { occasions, statuses } from "../models/Order";

export const uuidSchema = z.string().uuid("UUID inválido.");
export const keywordSchema = z.string().trim().min(1, "A busca não pode ficar vazia.").max(100).optional();
const text = (max: number) => z.string().trim().min(1, "Campo não pode ficar vazio.").max(max);
export const customerSchema = z.object({
  name: text(120),
  phone: text(30),
  email: z.string().trim().email("Email inválido.").max(150).nullable().optional(),
}).strict();
export const orderSchema = z.object({
  customer_id: uuidSchema,
  title: text(150),
  description: z.string().trim().max(500).nullable().optional(),
  occasion: z.enum(occasions).nullable().optional(),
  delivery_date: z.string().datetime({ offset: true, message: "Use uma data ISO 8601 válida com fuso horário." }),
  total_price: z.number().finite().min(0).max(99999999.99).refine(
    value => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
    "Preço deve ter no máximo duas casas decimais.",
  ),
  status: z.enum(statuses).optional(),
}).strict();
export const customerUpdateSchema = customerSchema.partial().refine(data => Object.keys(data).length > 0, "Informe ao menos um campo.");
export const orderUpdateSchema = orderSchema.partial().refine(data => Object.keys(data).length > 0, "Informe ao menos um campo.");
export const categorySchema = z.object({
  name: text(100),
  description: z.string().trim().max(500).nullable().optional(),
}).strict();
export const categoryUpdateSchema = categorySchema.partial()
  .refine(data => Object.keys(data).length > 0, "Informe ao menos um campo.");

const price = z.number().finite().min(0).max(99999999.99).refine(
  value => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
  "Preço deve ter no máximo duas casas decimais.",
);
export const productSchema = z.object({
  category_id: uuidSchema,
  name: text(150),
  description: z.string().trim().max(500).nullable().optional(),
  price,
}).strict();
export const productUpdateSchema = productSchema.partial()
  .refine(data => Object.keys(data).length > 0, "Informe ao menos um campo.");
