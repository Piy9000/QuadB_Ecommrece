import express, { Router } from "express";
import { CartController } from "../controller/cart.controller";
import { verifyToken } from "../middleware/jwt_token_verify";

export const cartRouter = Router();

const cart = new CartController();

// Routes that require authentication
cartRouter.use(verifyToken);

cartRouter.get("/cart", cart.getCart);
cartRouter.post("/cart", cart.addToCart);
cartRouter.delete("/cart/:id", cart.removeFromCart);
