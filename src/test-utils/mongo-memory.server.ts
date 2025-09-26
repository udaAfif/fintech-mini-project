import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

export const connectMongoMemory = async () => {
  mongod = await MongoMemoryServer.create({
    binary: {
      version: "6.0.5",
    },
  });
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    dbName: "testdb",
  });
};

export const clearDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
};
