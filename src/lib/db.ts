import mongoose from "mongoose";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("MONGODB_URI is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDb = async () => {
  if (cached.conn) {
    console.log("✅ MongoDB Already Connected");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting MongoDB...");

    cached.promise = mongoose
      .connect(mongodbUri, {
        serverSelectionTimeoutMS: 30000,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongoose.connection;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};

export default connectDb;