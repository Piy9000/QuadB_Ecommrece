import express, { Request } from "express";
import { User } from "../../model/user";
import { searchJoi } from "../../helper/joiValidation";

export const search = async (req: Request) => {
  const phoneNumber = req.body.phoneNumber || req.query.phoneNumber;
  const keyword = phoneNumber
    ? {
        phoneNumber: { $regex: phoneNumber, $options: "i" },
      }
    : {};
    const result = searchJoi.validate({ phoneNumber: phoneNumber });
    if (result.error) {
      const { error } = result;
      return { validate: false, msg: error };
    }
  try {
    const user = await User.find(keyword).find({
      _id: { $ne: req.body.user._id },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
};
