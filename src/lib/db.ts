import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

// Set Node.js environment variable to disable SSL certificate validation
// This is a workaround for the TLS alert internal error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Use the MongoDB URI directly
const uri = process.env.MONGODB_URI;

// Minimal options to avoid conflicts with connection string parameters
const options = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const connectWithRetry = async (mongoClient: MongoClient): Promise<MongoClient> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    return await mongoClient.connect();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = connectWithRetry(client);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = connectWithRetry(client);
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;