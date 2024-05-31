import express, { Express, Request, Response } from 'express';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./apps/routes/userRoutes";
import User from "./schema/User";
import { initDB } from "./apps/services/dbConnect";
import dotenv from 'dotenv'; // Import the dotenv package
import { initPassport } from "./apps/services/passport-jwt";


// Load environment variables from .env file
dotenv.config();

// Access environment vari

// const app: Application = express();
const app: Express = express();
console.log(process.env.PORT);

// Set up middleware
app.use(bodyParser.json());
//app.use(cors());
app.use(cors({ origin: 'http://localhost:3000' }));

// Connect to MongoDB
initDB();
initPassport();

async function exampleUsage() {
  try {
    // Create a new user
    const newUser = await User.create({
      isAdmin: true,
      name: "John",
      phoneNumber: "123",
      email:"test@gmail.com",
      password:"123",
      blocked: false,
      createdAt:"5-31-2024",

    });

    console.log("New user created:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

//exampleUsage();
// Use userRoutes
app.use("/api/user", userRoutes);

app.get('/check', (req: Request, res: Response) => {
  // Check if the server is reachable
  
    res.status(200).json({ message: 'Server is reachable' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
