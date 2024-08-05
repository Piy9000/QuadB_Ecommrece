import express, { Router, Request, Response } from "express";
import { ProductController } from "../controller/product.controller";
import { verifyToken } from "../middleware/jwt_token_verify";

export const productRouter = Router();

const product = new ProductController();

// Public routes
productRouter.get("/products", product.listProducts);
productRouter.get("/products/:id", product.getProduct);

// Routes that require authentication and admin privileges
productRouter.use(verifyToken);

productRouter.post("/products", product.createProduct);
productRouter.put("/products/:id", product.updateProduct);
productRouter.delete("/products/:id", product.deleteProduct);
