import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    _id: { type: String },
    sender: { type: mongoose.Schema.Types.String, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.String, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.String, ref: "User" }],
    deleteBy: [{ type: mongoose.Schema.Types.String, ref: "User" }],
  },
  { timestamps: true, versionKey: false }
);

export const Message = mongoose.model("Message", messageSchema);
