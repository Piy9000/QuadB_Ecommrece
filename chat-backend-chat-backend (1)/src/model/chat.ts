import mongoose from "mongoose";

const chatModel = new mongoose.Schema(
  {
    _id: { type: String },
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    users: [
      {
        participants: { type: mongoose.Schema.Types.String, ref: "User" },
        timestamps: { type: Date },
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.String,
      ref: "Message",
    },
    deleteBy: [{ type: String }],
    groupAdmin: { type: mongoose.Schema.Types.String, ref: "User" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



export const Chat = mongoose.model("Chat", chatModel);
