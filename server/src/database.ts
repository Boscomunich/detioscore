import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "ditioscoreDB",
    });

    console.log("✅ Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default mongoose;
