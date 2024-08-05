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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_1 = require("../model/chat");
const uuid_1 = require("uuid");
const user_1 = require("../model/user");
class ChatController {
    constructor() {
        this.accessChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body;
            if (!userId) {
                console.log("UserId param not sent with the request");
                return res.sendStatus(400);
            }
            try {
                const userChat = yield chat_1.Chat.find({
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
                    const previusChatWithUser = yield chat_1.Chat.find({
                        isGroupChat: false,
                        "users.participants": { $all: [req.body.user._id, userId] },
                        deleteBy: { $in: [req.body.user._id] },
                    });
                    if (previusChatWithUser.length > 0) {
                        try {
                            const regenrateChatWithSameUser = yield chat_1.Chat.findByIdAndUpdate({ _id: previusChatWithUser[0]._id }, { $unset: { deleteBy: [] } });
                            console.log(regenrateChatWithSameUser);
                            return res.status(200).send(regenrateChatWithSameUser);
                        }
                        catch (error) {
                            res.send(500).send("Internal error");
                        }
                    }
                }
                if (userChat.length > 0) {
                    // res.status(200).send(userChat[0]);
                    res.status(200).send({});
                }
                else {
                    const chatData = {
                        _id: (0, uuid_1.v4)(),
                        chatName: "sender",
                        isGroupChat: false,
                        users: [
                            { participants: req.body.user._id, timestamps: Date.now() },
                            { participants: userId, timestamps: Date.now() },
                        ],
                    };
                    const chat = new chat_1.Chat(chatData);
                    const createdChat = yield chat.save();
                    const fullChat = yield chat_1.Chat.findOne({ _id: createdChat._id }).populate("users.participants", "-password");
                    res.status(201).json(fullChat);
                }
            }
            catch (error) {
                console.error("Error accessing chat:", error);
                res.status(500).send("Internal Server Error");
            }
        });
        this.deleteChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const chat = yield chat_1.Chat.findByIdAndUpdate({ _id: req.body.chatId }, {
                    $push: {
                        deleteBy: req.body.user._id,
                    },
                });
                if (!chat) {
                    res.send("error");
                }
                res.send(chat);
            }
            catch (e) {
                res.status(500).send("Internal Server Error");
            }
        });
        this.fetchChats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield chat_1.Chat.find({
                    "users.participants": req.body.user._id,
                })
                    .populate("users.participants", "-password")
                    .populate("groupAdmin", "-password")
                    .populate("latestMessage")
                    .sort({ updatedAt: -1 });
                const result = yield user_1.User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(result);
            }
            catch (error) {
                res.status(400).send("Internal server error");
            }
        });
        this.createGroupChat = (req, res) => __awaiter(this, void 0, void 0, function* () {
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
                const groupChat = yield chat_1.Chat.create({
                    _id: (0, uuid_1.v4)(),
                    chatName: req.body.chatName,
                    deleteBy: [],
                    users: group.map((item) => ({
                        participants: item,
                        timestamps: Date.now(),
                    })),
                    isGroupChat: true,
                    groupAdmin: req.body.user._id,
                });
                const fullGroupChat = yield chat_1.Chat.findByIdAndUpdate({ _id: groupChat._id }, { $unset: { "users.$[]._id": "" } }, { new: true })
                    .populate("users.participants", "-password")
                    .populate("groupAdmin", "-password");
                res.status(201).json(fullGroupChat);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
        this.renameGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // rename the existing group
            if (!req.body.chatName || !req.body.groupId) {
                return res.status(400).send({ message: "Please Fill all the feilds" });
            }
            try {
                const updateData = yield chat_1.Chat.findByIdAndUpdate({ _id: req.body.groupId }, { chatName: req.body.chatName }, { new: true })
                    .populate("users.participants", "-password")
                    .populate("groupAdmin", "-password");
                if (!updateData) {
                    return res.status(400).send("Internal server error");
                }
                res.status(200).send(updateData);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
        this.addNewUserInGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // add user to group
            if (!req.body.userId || !req.body.groupId) {
                return res.status(400).send({ message: "Please Fill all the feilds" });
            }
            // in this line we check user already exists in group or not
            const results = yield chat_1.Chat.find({ _id: req.body.groupId }).find({
                "users.participants": req.body.userId,
            });
            if (results.length > 0) {
                return res
                    .status(400)
                    .send({ success: false, msg: "user already exists" });
            }
            try {
                yield chat_1.Chat.findByIdAndUpdate({ _id: req.body.groupId }, {
                    $push: {
                        users: { participants: req.body.userId, timestamps: Date.now() },
                    },
                }, { new: true });
                const addUser = yield chat_1.Chat.findByIdAndUpdate({ _id: req.body.groupId }, { $unset: { "users.$[]._id": "" } }, { new: true })
                    .populate("users.participants", "-password")
                    .populate("groupAdmin", "-password");
                if (!addUser) {
                    return res.status(400).send("you enter wrong group id");
                }
                res.status(200).send(addUser);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
        this.removeUserInGroup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // add user to group
            if (!req.body.userId || !req.body.groupId) {
                return res.status(400).send({ message: "Please Fill all the feilds" });
            }
            try {
                const removerUser = yield chat_1.Chat.findByIdAndUpdate({ _id: req.body.groupId }, { $pull: { users: { participants: req.body.userId } } }, { new: true })
                    .populate("users.participants", "-password")
                    .populate("groupAdmin", "-password");
                if (!removerUser) {
                    return res.status(400).send("you enter wrong group id");
                }
                res.status(200).send(removerUser);
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
}
exports.ChatController = ChatController;
