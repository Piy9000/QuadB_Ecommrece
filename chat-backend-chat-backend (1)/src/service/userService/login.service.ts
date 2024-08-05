import { Request } from "express";
import bcrypt from "bcryptjs";
import { userSchema } from "../../helper/joiValidation";
import { User } from "../../model/user";
import jwt from "jsonwebtoken";

export const tokenGenrate = (id: string) => {
  if (process.env.JWT_TOKEN) {
    const JWT = jwt.sign({ _id: id }, process.env.JWT_TOKEN);
    return JWT;
  }
  return false;
};

interface Iuser {
  _id: string;
  password: string;
  _doc: Record<string, string>;
}

export const login = async (req: Request) => {
  const { email, password } = req.body;
  console.log(email,password)
  try {
    const user: Iuser | null = await User.findOne({ email: email });
    if (user) {
      const verify = await bcrypt.compare(password, user.password);
      const token = tokenGenrate(user._id);
      console.log(user._id);
      if (verify && user) {
        return { ...user._doc, password: null, token };
      } else {
        return { status: false, msg: "wrong password" };
      }
    }
    return { status: false, msg: "user not found" };
  } catch (e) {
    return { status: false, msg: "somthing wrong", error: e };
  }
};
