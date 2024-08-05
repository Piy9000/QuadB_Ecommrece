import { Router } from "express";
import { verifyToken } from "../middleware/jwt_token_verify";
import { MessageController } from "../controller/meassge.controller";

export const messageRouter = Router();

const message = new MessageController()

messageRouter.use(verifyToken)

messageRouter.post('/', message.sendMessage)

messageRouter.get('/:chatId', message.allMessages)

messageRouter.delete('/:messageId', message.deleteMessage)

messageRouter.patch('/:messageId', message.editMeassge)