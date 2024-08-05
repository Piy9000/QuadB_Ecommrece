"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    _id: { type: String },
    message: { type: String, trim: true },
    chat: { type: mongoose_1.default.Schema.Types.String, ref: "Chat" },
    recipient: { type: mongoose_1.default.Schema.Types.String, ref: "User" },
    messageIds: [{ type: mongoose_1.default.Schema.Types.String, ref: "Message" }],
    read: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
exports.Notification = mongoose_1.default.model("Notification", notificationSchema);
