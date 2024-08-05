"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const express_1 = require("express");
const cart_controller_1 = require("../controller/cart.controller");
const jwt_token_verify_1 = require("../middleware/jwt_token_verify");
exports.cartRouter = (0, express_1.Router)();
const cart = new cart_controller_1.CartController();
// Routes that require authentication
exports.cartRouter.use(jwt_token_verify_1.verifyToken);
exports.cartRouter.get("/cart", cart.getCart);
exports.cartRouter.post("/cart", cart.addToCart);
exports.cartRouter.delete("/cart/:id", cart.removeFromCart);
