import mongoose from "mongoose";
import "colors";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB".green.bold);
  } catch (error) {
    console.error("Error connecting to MongoDB".red.bold, error);
    process.exit(1);
  }
};
