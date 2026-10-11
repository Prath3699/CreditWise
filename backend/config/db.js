import mongoose from 'mongoose';

const connectDB = async () => {
  let uri = process.env.MONGO_URI;
  if (!uri) {
    // Dev fallback #1: local persistent MongoDB (data survives restarts)
    // e.g. brew services start mongodb-community  OR  docker run -d -p 27017:27017 mongo:7
    const localUri = 'mongodb://127.0.0.1:27017/credwise';
    try {
      const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 1500 });
      console.log(`MongoDB Connected (persistent local): ${conn.connection.host}`);
      return conn;
    } catch {
      console.warn('No local MongoDB found, falling back to in-memory DB (data resets on restart).');
    }
    // Dev fallback #2: in-memory MongoDB
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri('credwise');
    console.log('Using in-memory MongoDB:', uri);
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;