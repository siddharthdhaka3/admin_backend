import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import { hashPassword } from "../services/user";
export interface logUser {
  password: string;
}

export interface UserDocument{
  isAdmin: boolean;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  blocked: boolean;
  createdAt: string;
  refreshToken:string;
}

// export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument>({
  isAdmin: { type: Boolean, default: false },
  name: { type: String },
  phoneNumber: { type: String },
  email: { type: String, required: true, unique: true },
  blocked: { type: Boolean, default: false },
  password: { type: String },
  refreshToken:{ type: String, defualt: "" },
}, 
{ timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

// const User: UserModel = mongoose.model<UserDocument>("User", userSchema);

export default mongoose.model<UserDocument>("user", userSchema);
