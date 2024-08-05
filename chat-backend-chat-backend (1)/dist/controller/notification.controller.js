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
exports.NotificationCarry = void 0;
const notification_1 = require("../model/notification");
class NotificationCarry {
    constructor() {
        this.sendNotification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (req.params.chatId) {
                try {
                    const notification = yield notification_1.Notification.find({
                        chat: req.params.chatId,
                        recipient: req.body.user._id,
                        read: false,
                    });
                    yield notification_1.Notification.updateMany({
                        chat: req.params.chatId,
                        recipient: req.body.user._id,
                        read: false,
                    }, { read: true });
                    console.log(notification, "backend");
                    return res.status(200).send(notification);
                }
                catch (error) {
                    res.status(500).send(error);
                }
            }
            res.status(404).send({ msg: "user not send chatId in parms" });
        });
    }
}
exports.NotificationCarry = NotificationCarry;
