import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { mainRouter } from "./router/rootRouter";
import { MongoClient } from "mongodb";
import Cors from "cors";
import { Socket } from "socket.io";
import { Message } from "./model/message";
import { MessageInfo } from "./interface/notification";
import { v4 as uuidv4 } from "uuid";
import { Notification } from "./model/notification";
import { Router } from "express";


dotenv.config();

// const url =
//   "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

 const url = "mongodb://127.0.0.1:27017/"
const app = express();
const port = 8000;

app.use(Cors());

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(mainRouter);

mongoose.set("strictQuery", true);
mongoose
  .connect(url, { dbName: "ecommrece" })
  .then(() => {})
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
const server = app.listen(port, () => {
  console.log("Server is running on port", port);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://tamplate.web.app",
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  // console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", ({ chatId, auth }) =>
    socket.in(chatId).emit("typing", { chatId, auth })
  );
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("unreadBy", async ({ messageIds, userId, chatId }) => {
    try {
      const result = await Message.updateMany(
        { _id: { $in: messageIds } },
        { $push: { readBy: userId } }
      );
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
    const updatedData = await Message.find({ _id: { $in: messageIds } });
    socket.in(chatId).emit("readby", updatedData);
  });

  socket.on("new message", (newMessageRecieved) => {
    const lastMessageId = socket.data.lastMessageId || null;
    var chat = newMessageRecieved.chat;

    if (!chat?.users) return console.log("chat.users not defined");

    chat.users.forEach((user: { participants: { _id: string | string[] } }) => {
      if (
        user.participants._id !== newMessageRecieved.sender._id &&
        newMessageRecieved._id !== lastMessageId
      ) {
        socket
          .in(user.participants._id)
          .emit("messageReceived", newMessageRecieved);
        socket.data.lastMessageId = newMessageRecieved._id;
        console.log("Sss");
      }
    });
  });

  socket.off("setup", (userData) => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

console.log("index");
