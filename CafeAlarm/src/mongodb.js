import mongoose from "mongoose";

const mongodbUri = process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error("MONGODB_URI 환경변수가 필요합니다.");
}

export const connectMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(mongodbUri);
  return mongoose.connection;
};
