import express from "express";
import customerRoutes from "./routes/customerRoutes";
import orderRoutes from "./routes/orderRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));
app.get("/", (_req, res) => {
  res.json({ message: "Confectionery Orders API", status: "running" });
});
app.get("/health", (_req, res) => { res.json({ status: "ok" }); });
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use((_req, res) => { res.status(404).json({ message: "Rota não encontrada." }); });
app.use(errorHandler);
export default app;
