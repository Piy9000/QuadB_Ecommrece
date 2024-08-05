import express, { Response, Router, Request } from "express";
import { verifyToken } from "../middleware/jwt_token_verify";
import { ChatController } from "../controller/chat.controller";

export const chatRouter = Router();

const chatController = new ChatController();

chatRouter.use(verifyToken);

chatRouter.post('/', chatController.accessChat)
chatRouter.get('/', chatController.fetchChats)
chatRouter.post('/group', chatController.createGroupChat)

chatRouter.delete('/',chatController.deleteChat)

chatRouter.post('/rename',chatController.renameGroup)


chatRouter.post('/addnewuser', chatController.addNewUserInGroup)

chatRouter.delete("/removeuser", chatController.removeUserInGroup)



