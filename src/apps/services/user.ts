import bcrypt from "bcrypt";
import User, { UserDocument } from "../../schema/User";
import { resetPasswordEmailTemplate, sendEmail } from "./email";
import { createUserTokens } from "./passport-jwt";

export const createUserWithResetPasswordLink = async (data: {
  email: string;
}) => {
  console.log(data);
  
  await User.create(data);
  const user = await getUserByEmail(data.email);
  const { accessToken } = await createUserTokens(user!);
  await sendEmail({
    to: user!.email,
    subject: "Reset password",
    html: resetPasswordEmailTemplate(accessToken),
  });
  console.log(user);
  
  return user;
};

export const createUser = async (data: {
  email: string;
  password: string;
  isAdmin:boolean; 
  phoneNumber:string;
  name:string; 
  blocked:boolean;
  createdAt:string;
}) => {
  const user = await User.create({ ...data, active: true });
  return user;
};

export const updateUser = async (userId: string, data: Partial<UserDocument>) => {
  const user = await User.findOneAndUpdate({ _id: userId }, data, {
    new: true,
    projection: "-password",
  });
  return user;
};
export const updateUserByEmail = async (email: string, data: Partial<UserDocument>) => {
  const user = await User.findOneAndUpdate({ email: email}, data, {
    new: true,
    projection: "-password",
  });
  return user;
};


export const deleteUser = async (userId: string) => {
  const user = await User.deleteOne({ _id: userId });
  return user;
};

export const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email: email }).lean();
  return user;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).lean();
  return user;
};

export const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};
