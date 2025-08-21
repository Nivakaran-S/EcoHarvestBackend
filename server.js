const serverless = require('serverless-http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./src/app'); // Your Express app

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// MongoDB connection function
async function connectToMongoDB() {
  if (mongoose.connection.readyState === 0) { // Not connected
    try {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  }
}

// Wrap Express app with serverless-http
const handler = serverless(app);

// Serverless handler
module.exports = async (req, res) => {
  try {
    await connectToMongoDB();
    return handler(req, res);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};