import mongoose from 'mongoose';

const connectDB = async () => {
  // Fall back to an in-memory MongoDB when no MONGO_URI is configured (dev)
  let uri = process.env.MONGO_URI;
  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri('credwise');
    console.log('Using in-memory MongoDB:', uri);
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;