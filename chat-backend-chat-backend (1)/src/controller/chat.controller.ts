import { Request, Response } from "express";
import { Chat } from "../model/chat";
import { v4 as uuidv4 } from "uuid";
import { User } from "../model/user";

export class ChatController {
  accessChat = async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      console.log("UserId param not sent with the request");
      return res.sendStatus(400);
    }

    try {
      const userChat = await Chat.find({
        isGroupChat: false,
        "users.participants": { $all: [req.body.user._id, userId] },
        deleteBy: { $ne: [req.body.user._id] },
      })
        .populate("users.participants", "-password")
        .populate({
          path: "latestMessage",
          populate: { path: "sender", select: "name pic email" },
        });

      console.log(userChat);

      if (userChat.length === 0) {
        const previusChatWithUser = await Chat.find({
          isGroupChat: false,
          "users.participants": { $all: [req.body.user._id, userId] },
          deleteBy: { $in: [req.body.user._id] },
        });

        if (previusChatWithUser.length > 0) {
          try {
            const regenrateChatWithSameUser = await Chat.findByIdAndUpdate(
              { _id: previusChatWithUser[0]._id },
              { $unset: { deleteBy: [] } }
            );

            console.log(regenrateChatWithSameUser);
            return res.status(200).send(regenrateChatWithSameUser);
          } catch (error) {
            res.send(500).send("Internal error");
          }
        }
      }
      if (userChat.length > 0) {
        // res.status(200).send(userChat[0]);
        res.status(200).send({});
      } else {
        const chatData = {
          _id: uuidv4(),
          chatName: "sender",
          isGroupChat: false,
          users: [
            { participants: req.body.user._id, timestamps: Date.now() },
            { participants: userId, timestamps: Date.now() },
          ],
        };

        const chat = new Chat(chatData);
        const createdChat = await chat.save();

        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users.participants",
          "-password"
        );
        res.status(201).json(fullChat);
      }
    } catch (error) {
      console.error("Error accessing chat:", error);
      res.status(500).send("Internal Server Error");
    }
  };

  deleteChat = async (req: Request, res: Response) => {
    try {
      const chat = await Chat.findByIdAndUpdate(
        { _id: req.body.chatId },
        {
          $push: {
            deleteBy: req.body.user._id,
          },
        }
      );
      if (!chat) {
        res.send("error");
      }
      res.send(chat);
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  };

  fetchChats = async (req: Request, res: Response) => {
    try {
      const results = await Chat.find({
        "users.participants": req.body.user._id,
      })
        .populate("users.participants", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      const result = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });

      res.status(200).send(result);
    } catch (error) {
      res.status(400).send("Internal server error");
    }
  };

  createGroupChat = async (req: Request, res: Response) => {
    if (!req.body.group || !req.body.chatName) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    const group = JSON.parse(req.body.group);

    if (group.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }

    group.push(req.body.user._id);

    try {
      const groupChat = await Chat.create({
        _id: uuidv4(),
        chatName: req.body.chatName,
        deleteBy: [],
        users: group.map((item: any) => ({
          participants: item,
          timestamps: Date.now(),
        })),
        isGroupChat: true,
        groupAdmin: req.body.user._id,
      });

      const fullGroupChat = await Chat.findByIdAndUpdate(
        { _id: groupChat._id },
        { $unset: { "users.$[]._id": "" } },
        { new: true }
      )
        .populate("users.participants", "-password")
        .populate("groupAdmin", "-password");

      res.status(201).json(fullGroupChat);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  renameGroup = async (req: Request, res: Response) => {
    // rename the existing group
    if (!req.body.chatName || !req.body.groupId) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    try {
      const updateData = await Chat.findByIdAndUpdate(
        { _id: req.body.groupId },
        { chatName: req.body.chatName },
        { new: true }
      )
        .populate("users.participants", "-password")
        .populate("groupAdmin", "-password");
      if (!updateData) {
        return res.status(400).send("Internal server error");
      }
      res.status(200).send(updateData);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  addNewUserInGroup = async (req: Request, res: Response) => {
    // add user to group
    if (!req.body.userId || !req.body.groupId) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
    // in this line we check user already exists in group or not
    const results = await Chat.find({ _id: req.body.groupId }).find({
      "users.participants": req.body.userId,
    });

    if (results.length > 0) {
      return res
        .status(400)
        .send({ success: false, msg: "user already exists" });
    }

    try {
      await Chat.findByIdAndUpdate(
        { _id: req.body.groupId },
        {
          $push: {
            users: { participants: req.body.userId, timestamps: Date.now() },
          },
        },
        { new: true }
      );

      const addUser = await Chat.findByIdAndUpdate(
        { _id: req.body.groupId },
        { $unset: { "users.$[]._id": "" } },
        { new: true }
      )
        .populate("users.participants", "-password")
        .populate("groupAdmin", "-password");

      if (!addUser) {
        return res.status(400).send("you enter wrong group id");
      }
      res.status(200).send(addUser);
    } catch (error) {
      res.status(500).send(error);
    }
  };

  removeUserInGroup = async (req: Request, res: Response) => {
    // add user to group
    if (!req.body.userId || !req.body.groupId) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    try {
      const removerUser = await Chat.findByIdAndUpdate(
        { _id: req.body.groupId },
        { $pull: { users: { participants: req.body.userId } } },
        { new: true }
      )
        .populate("users.participants", "-password")
        .populate("groupAdmin", "-password");
      if (!removerUser) {
        return res.status(400).send("you enter wrong group id");
      }
      res.status(200).send(removerUser);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}
