import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
const app: Application = express();


const bostrap = async () => {
  try {
    // Start the server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

bostrap();