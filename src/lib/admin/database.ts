import mongoose from "mongoose";
import { isAdminConfigured } from "./config";
import { retryTransient } from "./database-resilience";

declare global {
  // eslint-disable-next-line no-var
  var luckyCableConnection: Promise<typeof mongoose> | undefined;
  var luckyCableModelsInitialized: boolean | undefined;
}

export async function connectDatabase() {
  if (!isAdminConfigured()) throw new Error("Management database is not configured");
  if (mongoose.connection.readyState === 1) return mongoose;
  if (mongoose.connection.readyState === 0) globalThis.luckyCableConnection = undefined;
  globalThis.luckyCableConnection ??= retryTransient(async () => {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect().catch(() => undefined);
    const connection = await mongoose.connect(process.env.MONGODB_URI!, { dbName: process.env.MONGODB_DB!, serverSelectionTimeoutMS: 8000, connectTimeoutMS: 8000, socketTimeoutMS: 20000, maxIdleTimeMS: 60000, bufferCommands: false });
    if (!globalThis.luckyCableModelsInitialized) {
      await Promise.all(Object.values(connection.models).map(model => model.init()));
      globalThis.luckyCableModelsInitialized = true;
    }
    return connection;
  }, { attempts: 3, baseDelayMs: 350 }).catch(error => { globalThis.luckyCableConnection = undefined; throw error; });
  return globalThis.luckyCableConnection;
}