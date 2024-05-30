import mongoose from "mongoose";
import dotenv from 'dotenv'; // Import the dotenv package

// Load environment variables from .env file
dotenv.config();
export const initDB = async (): Promise<boolean> => {
      return await new Promise((resolve, reject) => {
        const mongoURI = process.env.MONGO_URI ?? "";
    
        if (mongoURI === "") throw new Error("mongod db uri not found!");
        mongoose.set("strictQuery", false);
        mongoose
          .connect(mongoURI)
          .then(() => {
            console.log("DB Connected!");
            resolve(true);
          })
          .catch(reject);
      });
    };