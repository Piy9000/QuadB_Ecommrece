"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel = new mongoose_1.default.Schema({
    _id: { type: String },
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    pic: {
        type: String,
        required: true,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    users: [
        {
            participants: { type: mongoose_1.default.Schema.Types.String, ref: "User" },
            timestamps: { type: Date },
        },
    ],
    latestMessage: {
        type: mongoose_1.default.Schema.Types.String,
        ref: "Message",
    },
    deleteBy: [{ type: String }],
    groupAdmin: { type: mongoose_1.default.Schema.Types.String, ref: "User" },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Chat = mongoose_1.default.model("Chat", chatModel);
