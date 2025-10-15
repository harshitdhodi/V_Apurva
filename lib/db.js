import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
      connectTimeoutMS: 30000, // 30 seconds timeout
      maxPoolSize: 10, // Limit concurrent connections
      minPoolSize: 1, // Maintain at least 1 connection
      maxIdleTimeMS: 10000, // Close idle connections after 10 seconds
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI)
      .then((mongoose) => mongoose.connection)
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export { connectDB };