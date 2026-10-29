import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const controller = new CategoryController();
router.get("/", asyncHandler(controller.list));
router.get("/:id/products", asyncHandler(controller.listProducts));
router.get("/:id", asyncHandler(controller.get));
router.post("/", asyncHandler(controller.create));
router.put("/:id", asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
