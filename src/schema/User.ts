import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument{
  isAdmin: boolean;
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  blocked: boolean;
  createdAt: string;
}

// export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument>({
  isAdmin: { type: Boolean, required: true },
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  blocked: { type: Boolean, default: false },
  password: { type: String },
}, 
{ timestamps: true }
);

// const User: UserModel = mongoose.model<UserDocument>("User", userSchema);

export default mongoose.model<UserDocument>("user", userSchema);
