import { Request, Response } from "express";
import { Notification } from "../model/notification";

export class NotificationCarry {
  sendNotification = async (req: Request, res: Response) => {
    if (req.params.chatId) {
      try {
        const notification = await Notification.find({
          chat: req.params.chatId,
          recipient: req.body.user._id,
          read: false,
        });
        await Notification.updateMany(
          {
            chat: req.params.chatId,
            recipient: req.body.user._id,
            read: false,
          },
          { read: true }
        );
        console.log(notification, "backend");
        return res.status(200).send(notification);
      } catch (error) {
        res.status(500).send(error);
      }
    }
    res.status(404).send({ msg: "user not send chatId in parms" });
  };
}
