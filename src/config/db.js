import mongoose from "mongoose";

export const dbConnect = async (startServer) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_NAME,
    });

    console.log("Connected to MongoDB successfully!");

    startServer();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};
