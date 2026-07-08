import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Provide your MongoDB connection string.",
  );
}

const MONGODB_URI = process.env.MONGODB_URI;

// Cache the connection across hot-reloads (dev) and serverless invocations (Vercel)
declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: mongoose.Connection | undefined;
}

async function connectDB(): Promise<mongoose.Connection> {
  if (global.__mongooseConn && global.__mongooseConn.readyState === 1) {
    return global.__mongooseConn;
  }
  const conn = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });
  global.__mongooseConn = conn.connection;
  return conn.connection;
}

export { connectDB };
export * from "./schema";
