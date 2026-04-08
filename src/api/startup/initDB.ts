import mongoose from "mongoose";
import config from "../config";

const initDB = async () => {
  if (!config.DATABASE_CONNECTION_STRING) {
    throw new Error("No database connection string.");
  }

  try {
    await mongoose.connect(config.DATABASE_CONNECTION_STRING, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    console.log("Connected to 💾 MongoDB!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default initDB;

