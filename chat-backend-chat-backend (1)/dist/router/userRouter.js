"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const product_controller_1 = require("../controller/product.controller");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
const user = new user_controller_1.UserController();
const product = new product_controller_1.ProductController();
// Public routes
userRouter.post("/register", user.createUser);
userRouter.post("/login", user.loginUser);
// Authentication middleware applied only to routes that need it
// Protected routes
userRouter.post("/search", user.searchUser);
userRouter.post('/autologin', user.loginWithAccessToken);
