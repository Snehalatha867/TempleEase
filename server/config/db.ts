import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI is required in production. Refusing to start without persistent storage.');
    }
    console.log('[Database] No MONGODB_URI environment variable provided. Running with the in-memory development fallback.');
    return false;
  }

  try {
    console.log(`[Database] Attempting connection to MongoDB (${uri.replace(/:([^:@]{1,})@/, ':****@')})...`);
    mongoose.set('strictQuery', false);
    
    // Connect with a 3-second timeout so server doesn't hang if local mongod isn't started
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });

    isConnected = true;
    console.log('[Database] MongoDB successfully connected.');
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`MongoDB connection failed in production. Refusing to use in-memory storage. ${message}`);
    }
    console.warn(`[Database] Notice: MongoDB connection could not be established (${message}).`);
    console.log('[Database] Activating the in-memory development fallback.');
    isConnected = false;
    return false;
  }
};

export const getDBStatus = () => {
  return {
    connected: isConnected,
    mode: isConnected ? 'MongoDB' : 'In-memory development fallback',
    uriConfigured: Boolean(process.env.MONGODB_URI)
  };
};
