import mongoose from 'mongoose';

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  let uri = process.env.MONGO_URI;

  if (!uri && isProduction) {
    console.error('MONGO_URI is required in production. Refusing to start with an in-memory DB.');
    process.exit(1);
  }

  if (!uri) {
    // Dev fallback #1: local persistent MongoDB (data survives restarts)
    // e.g. brew services start mongodb-community  OR  docker run -d -p 27017:27017 mongo:7
    const localUri = 'mongodb://127.0.0.1:27017/credwise';
    try {
      const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 1500 });
      console.log(`MongoDB Connected (persistent local): ${conn.connection.host}`);
      return conn;
    } catch {
      console.warn(
        'No local MongoDB found, falling back to in-memory DB (data resets on restart).',
      );
    }

    // Dev fallback #2: in-memory MongoDB
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    uri = mongod.getUri('credwise');
    console.log('Using in-memory MongoDB:', uri);
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
