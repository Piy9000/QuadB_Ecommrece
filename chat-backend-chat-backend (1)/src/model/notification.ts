import mongoose from "mongoose";


const notificationSchema = new mongoose.Schema(
    {
      _id: { type: String },
      message: { type: String, trim: true },
      chat: { type: mongoose.Schema.Types.String, ref: "Chat" },
      recipient: { type: mongoose.Schema.Types.String, ref: "User" },
      messageIds: [{ type: mongoose.Schema.Types.String, ref: "Message" }],
      read: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false }
  );

  export const Notification = mongoose.model("Notification", notificationSchema);