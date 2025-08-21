import mongoose from 'mongoose';
import serverless from 'serverless-http';
import app from './src/app.js'; // Adjust path if needed

let isConnected = false;

async function connectToDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected');
  }
}

const handler = serverless(app);

export default async function(req, res) {
  try {
    await connectToDB();
    return handler(req, res);
  } catch (err) {
    console.error('Serverless function error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
