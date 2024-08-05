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
exports.MessageController = void 0;
const chat_1 = require("../model/chat");
const message_1 = require("../model/message");
const uuid_1 = require("uuid");
const notification_1 = require("../model/notification");
class MessageController {
    constructor() {
        this.allMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const chatId = req.params.chatId;
            const { page, limit } = req.query;
            try {
                const pageNumber = parseInt(page) || 1;
                const pageSize = parseInt(limit) || 20;
                const totalCount = yield message_1.Message.countDocuments({ chat: chatId });
                const totalPages = Math.ceil(totalCount / pageSize);
                if (totalCount > 0) {
                    const messages = yield message_1.Message.find({
                        chat: chatId,
                        deleteBy: { $ne: [req.body.user._id] },
                    })
                        .populate("sender", "name pic email")
                        .populate("chat")
                        .sort({ createdAt: 1 })
                        .skip((totalPages - pageNumber) * pageSize)
                        .limit(pageSize);
                    if (messages.length < pageSize && totalPages > pageNumber) {
                        const messages1 = yield message_1.Message.find({ chat: chatId })
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
                }
                else {
                    res.status(404).send({
                        message: "No Messages Found",
                    });
                }
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
        this.deleteMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteMessage = yield message_1.Message.findByIdAndUpdate(req.params.messageId, {
                    $push: {
                        deleteBy: req.body.user._id,
                    },
                }, { new: true });
                if (!deleteMessage) {
                    return res.send({ success: false, msg: "msg not delete" });
                }
                return res.send(deleteMessage);
            }
            catch (error) {
                return res.status(500).send(error);
            }
        });
        this.sendMessage = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const { content, chatId } = req.body;
            if (!content || !chatId) {
                console.log("Invalid data passed into request");
                return res.sendStatus(400);
            }
            var newMessage = {
                _id: (0, uuid_1.v4)(),
                sender: req.body.user._id,
                content: content,
                chat: chatId,
            };
            try {
                const newMessageInstance = new message_1.Message(newMessage);
                const saveMessage = yield newMessageInstance.save();
                let message = yield message_1.Message.findById({
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
                yield chat_1.Chat.findByIdAndUpdate(chatId, {
                    latestMessage: message,
                });
                if (message) {
                    const userId = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a._id) === ((_b = message.chat) === null || _b === void 0 ? void 0 : _b.users[0].participants._id)
                        ? (_c = message.chat) === null || _c === void 0 ? void 0 : _c.users[1].participants._id
                        : (_d = message.chat) === null || _d === void 0 ? void 0 : _d.users[0].participants._id;
                    const result = yield notification_1.Notification.find({
                        chat: (_e = message.chat) === null || _e === void 0 ? void 0 : _e._id,
                        recipient: userId,
                        read: false,
                    });
                    console.log(result);
                    if (result.length > 0) {
                        const updateNotification = yield notification_1.Notification.findByIdAndUpdate(result[0]._id, { $push: { messageIds: message._id } }, { new: true });
                        console.log(updateNotification);
                    }
                    if (result.length === 0) {
                        const detail = {
                            _id: (0, uuid_1.v4)(),
                            message: message.content,
                            chat: (_f = message.chat) === null || _f === void 0 ? void 0 : _f._id,
                            recipient: userId,
                            messageIds: [message._id],
                        };
                        try {
                            yield notification_1.Notification.create(detail);
                        }
                        catch (error) {
                            console.log("notinication not genrate");
                        }
                    }
                }
                return res.send(message);
            }
            catch (error) {
                res.status(400).send("error");
            }
        });
        this.editMeassge = (req, res) => {
            const messageId = req.params.messageId;
            const { content } = req.body;
            if (!messageId) {
                return res.status(400).send("message id is required");
            }
            if (!content) {
                return res.status(400).send("content is required");
            }
            try {
                const text = message_1.Message.findByIdAndUpdate({ messageId }, { content: content }, { new: true });
                if (!text) {
                    return res.status(400).send("message not found");
                }
                return res.send(text);
            }
            catch (error) {
                return res.status(400).send("Internal server error");
            }
        };
    }
}
exports.MessageController = MessageController;
