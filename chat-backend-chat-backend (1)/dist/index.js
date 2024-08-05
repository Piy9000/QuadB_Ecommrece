"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const rootRouter_1 = require("./router/rootRouter");
const cors_1 = __importDefault(require("cors"));
const message_1 = require("./model/message");
dotenv_1.default.config();
// const url =
//   "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
const url = "mongodb://127.0.0.1:27017/";
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(rootRouter_1.mainRouter);
mongoose_1.default.set("strictQuery", true);
mongoose_1.default
    .connect(url, { dbName: "ecommrece" })
    .then(() => { })
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
io.on("connection", (socket) => {
    // console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", ({ chatId, auth }) => socket.in(chatId).emit("typing", { chatId, auth }));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("unreadBy", ({ messageIds, userId, chatId }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield message_1.Message.updateMany({ _id: { $in: messageIds } }, { $push: { readBy: userId } });
            // console.log(result);
        }
        catch (error) {
            console.error(error);
        }
        const updatedData = yield message_1.Message.find({ _id: { $in: messageIds } });
        socket.in(chatId).emit("readby", updatedData);
    }));
    socket.on("new message", (newMessageRecieved) => {
        const lastMessageId = socket.data.lastMessageId || null;
        var chat = newMessageRecieved.chat;
        if (!(chat === null || chat === void 0 ? void 0 : chat.users))
            return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user.participants._id !== newMessageRecieved.sender._id &&
                newMessageRecieved._id !== lastMessageId) {
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
