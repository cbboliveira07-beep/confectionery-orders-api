import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();
const controller = new ProductController();
router.get("/", asyncHandler(controller.list));
router.get("/:id", asyncHandler(controller.get));
router.post("/", asyncHandler(controller.create));
router.put("/:id", asyncHandler(controller.update));
router.delete("/:id", asyncHandler(controller.delete));

export default router;
