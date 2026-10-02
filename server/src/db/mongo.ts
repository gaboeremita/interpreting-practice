import mongoose from "mongoose";

export async function connectToMongo(uri: string): Promise<void> {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10_000 });
}

export async function disconnectFromMongo(): Promise<void> {
  await mongoose.disconnect();
}
