import { Request } from "express";
import bcrypt from "bcryptjs";
import { userSchema } from "../../helper/joiValidation";
import { User } from "../../model/user";
import { v4 as uuidv4 } from "uuid";
import { tokenGenrate } from "./login.service";

export const passwordHash = async (password: string) => {
  return await bcrypt.hash(password, 8);
};

export const create = async (req: Request) => {
  const { email, password } = req.body;
  const result = userSchema.validate(req.body);

  if (result.error) {
    return { error: result.error.details };
  }
  const hashedPassword = await passwordHash(password);
  req.body["password"] = hashedPassword;
  try {
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return { email: "Email already exists" };
    } else {
      const user = await User.create({ ...req.body, _id: uuidv4() });
      //const token = tokenGenrate(user._id);
      return { ...user.toObject() }; // Convert user to plain object
    }
  } catch (error) {
    console.log('first',error)
    return { error };
  }
};
