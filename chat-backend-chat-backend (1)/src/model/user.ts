import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  timeStamp: number;
}

const userSchema: Schema<IUser> = new Schema({
  _id: { type: String, required: true},
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  timeStamp: { type: Number, default: Date.now },
}, { timestamps: true, versionKey: false });

export const User = mongoose.model<IUser>('User', userSchema);
