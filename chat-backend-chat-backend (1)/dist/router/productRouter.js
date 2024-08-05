"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_controller_1 = require("../controller/product.controller");
const jwt_token_verify_1 = require("../middleware/jwt_token_verify");
exports.productRouter = (0, express_1.Router)();
const product = new product_controller_1.ProductController();
// Public routes
exports.productRouter.get("/products", product.listProducts);
exports.productRouter.get("/products/:id", product.getProduct);
// Routes that require authentication and admin privileges
exports.productRouter.use(jwt_token_verify_1.verifyToken);
exports.productRouter.post("/products", product.createProduct);
exports.productRouter.put("/products/:id", product.updateProduct);
exports.productRouter.delete("/products/:id", product.deleteProduct);
