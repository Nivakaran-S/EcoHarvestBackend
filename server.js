import mongoose from 'mongoose';
import serverless from 'serverless-http';
import app from './src/app.js';  // ← make sure this path points to your Express app

let isConnected = false;

// Initialize MongoDB once per cold start
async function connectToDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('🌿 MongoDB connected');
  } catch (err) {
    console.error('🌿 MongoDB connection error:', err);
    throw err;
  }
}

const expressHandler = serverless(app);

async function handler(req, res) {
  try {
    await connectToDB();
    return expressHandler(req, res);
  } catch (err) {
    console.error('🚨 Serverless function error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;

