import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { verifyToken } from "../middleware/jwt_token_verify";
import { ProductController } from "../controller/product.controller";
import { productRouter } from "./productRouter";

const userRouter = Router();
const user = new UserController();
const product =new ProductController();

// Public routes

userRouter.post("/register", user.createUser);
userRouter.post("/login", user.loginUser);

// Authentication middleware applied only to routes that need it


// Protected routes

userRouter.post("/search", user.searchUser);
userRouter.post('/autologin', user.loginWithAccessToken);
//userRouter.use(verifyToken);

export { userRouter };
