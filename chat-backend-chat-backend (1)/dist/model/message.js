"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    _id: { type: String },
    sender: { type: mongoose_1.default.Schema.Types.String, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose_1.default.Schema.Types.String, ref: "Chat" },
    readBy: [{ type: mongoose_1.default.Schema.Types.String, ref: "User" }],
    deleteBy: [{ type: mongoose_1.default.Schema.Types.String, ref: "User" }],
}, { timestamps: true, versionKey: false });
exports.Message = mongoose_1.default.model("Message", messageSchema);
