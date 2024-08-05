import { Router } from "express";
import { verifyToken } from "../middleware/jwt_token_verify";
import { NotificationCarry } from "../controller/notification.controller";



export const notificationRouter = Router()

const NotificationController = new NotificationCarry()

notificationRouter.use(verifyToken)

notificationRouter.get('/:chatId', NotificationController.sendNotification)