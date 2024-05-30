import express, { Express, Request, Response } from 'express';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./apps/routes/userRoutes";
import User from "./schema/User";
import { initDB } from "./apps/services/dbConnect";
import dotenv from 'dotenv'; // Import the dotenv package

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

async function exampleUsage() {
  try {
    // Create a new user
    const newUser = await User.create({
      isAdmin: true,
      name: "John",
      phoneNumber: "1234567890",
    });

    console.log("New user created:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}


// Use userRoutes
app.use("/api/user", userRoutes);

// Start the server
app.post('/api/data', (req: Request, res: Response) => {
  // Assuming the request body contains JSON data
  const requestData = req.body;

  // Do something with the data (e.g., save it to a database)
  console.log('Received data:', requestData);

  // Respond with a success message
  res.json({ message: 'Data received successfully', data: requestData });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
