import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Clear the connection cache if the URI changes
let lastConnectionUri = '';

async function connectDB() {
  const currentUri ="mongodb+srv://harshit:Harshit%40123@userinfo.lmbsytd.mongodb.net/ApurvaChemical";
  
  // Clear cache if URI has changed
  if (lastConnectionUri && lastConnectionUri !== currentUri) {
    console.log('MongoDB URI changed, clearing connection cache');
    if (cached.conn) {
      await cached.conn.close();
    }
    cached.conn = null;
    cached.promise = null;
  }
  lastConnectionUri = currentUri;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('Creating new MongoDB connection to:', currentUri);
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds timeout
      connectTimeoutMS: 30000, // 30 seconds timeout
      maxPoolSize: 10, // Limit concurrent connections
      minPoolSize: 1, // Maintain at least 1 connection
      maxIdleTimeMS: 10000, // Close idle connections after 10 seconds
    };

    cached.promise = mongoose.connect(currentUri, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB database:', mongoose.connection.db.databaseName);
        return mongoose.connection;
      })
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