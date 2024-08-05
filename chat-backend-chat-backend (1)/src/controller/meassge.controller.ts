import { Request, Response } from "express";
import { Chat } from "../model/chat";
import { User } from "../model/user";
import { Message } from "../model/message";
import { v4 as uuidv4 } from "uuid";
import { Notification } from "../model/notification";
import { MessageInfo } from "../interface/notification";

export class MessageController {
  allMessages = async (req: Request, res: Response) => {
    const chatId = req.params.chatId;
    const { page, limit } = req.query;

    try {
      const pageNumber = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 20;

      const totalCount = await Message.countDocuments({ chat: chatId });
      const totalPages = Math.ceil(totalCount / pageSize);
      if (totalCount > 0) {
        const messages = await Message.find({
          chat: chatId,
          deleteBy: { $ne: [req.body.user._id] },
        })
          .populate("sender", "name pic email")
          .populate("chat")
          .sort({ createdAt: 1 })
          .skip((totalPages - pageNumber) * pageSize)
          .limit(pageSize);

        if (messages.length < pageSize && totalPages > pageNumber) {
          const messages1 = await Message.find({ chat: chatId })
            .populate("sender", "name pic email")
            .populate("chat")
            .sort({ createdAt: 1 })
            .skip((totalPages - 2) * pageSize)
            .limit(pageSize);
          messages1.push(...messages);

          return res.send({
            messages: messages1,
            page: 2,
            totalPages,
          });
        }
        if (messages) {
          return res.send({
            messages,
            page: pageNumber,
            totalPages,
          });
        }
      } else {
        res.status(404).send({
          message: "No Messages Found",
        });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  };

  deleteMessage = async (req: Request, res: Response) => {
    try {
      const deleteMessage = await Message.findByIdAndUpdate(
        req.params.messageId,
        {
          $push: {
            deleteBy: req.body.user._id,
          },
        },
        { new: true }
      );
      if (!deleteMessage) {
        return res.send({ success: false, msg: "msg not delete" });
      }
      return res.send(deleteMessage);
    } catch (error) {
      return res.status(500).send(error);
    }
  };

  sendMessage = async (req: Request, res: Response) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }

    var newMessage = {
      _id: uuidv4(),
      sender: req.body.user._id,
      content: content,
      chat: chatId,
    };

    try {
      const newMessageInstance = new Message(newMessage);
      const saveMessage = await newMessageInstance.save();

      let message: Partial<MessageInfo> | null = await Message.findById({
        _id: saveMessage._id,
      })
        .populate("sender", "name pic")
        .populate({
          path: "chat",
          populate: {
            path: "users.participants",
            model: "User",
          },
        });

      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: message,
      });

      if (message) {
        const userId =
          message?.sender?._id === message.chat?.users[0].participants._id
            ? message.chat?.users[1].participants._id
            : message.chat?.users[0].participants._id;

        const result = await Notification.find({
          chat: message.chat?._id,
          recipient: userId,
          read: false,
        });

        console.log(result);
        if (result.length > 0) {
          const updateNotification = await Notification.findByIdAndUpdate(
            result[0]._id,
            { $push: { messageIds: message._id } },
            { new: true }
          );
          console.log(updateNotification);
        }
        if (result.length === 0) {
          const detail = {
            _id: uuidv4(),
            message: message.content,
            chat: message.chat?._id,
            recipient: userId,
            messageIds: [message._id],
          };

          try {
            await Notification.create(detail);
          } catch (error) {
            console.log("notinication not genrate");
          }
        }
      }
      return res.send(message);
    } catch (error) {
      res.status(400).send("error");
    }
  };
  editMeassge = (req:Request, res:Response) => {
    const messageId = req.params.messageId;
    const {content} = req.body;
    if(!messageId) {
      return res.status(400).send("message id is required");
    }
    if(!content) {
      return res.status(400).send("content is required");
    }
    try {
      const text = Message.findByIdAndUpdate({messageId},{content:content},{new:true});
      if(!text){
        return res.status(400).send("message not found");
      }
      return res.send(text);
    } catch (error) {
      return res.status(400).send("Internal server error");
    }

  }
}
