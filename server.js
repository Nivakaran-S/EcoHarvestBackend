// server.js
const http = require('http');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config();

const app = require('./src/app');        // your Express app
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

let isConnected = false;

// MongoDB connection events (optional logging)
mongoose.connection.once('open', () => {
  console.log('🌿 MongoDB connection is ready!');
});
mongoose.connection.on('error', err => {
  console.error('🌿 Error connecting with MongoDB:', err);
});

// Connect to MongoDB (cached across invocations)
async function connectToDB() {
  if (isConnected) return;
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log('🌿 Connected to MongoDB');
}

// Wrap your Express app into a serverless handler
const expressHandler = serverless(app);

async function universalHandler(req, res) {
  try {
    await connectToDB();
    return expressHandler(req, res);
  } catch (err) {
    console.error('🚨 Serverless function error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// If run directly (local dev), start an HTTP server
if (require.main === module) {
  connectToDB()
    .then(() => {
      const server = http.createServer(app);
      server.listen(PORT, () => {
        console.log(`🚀 Local server listening on port ${PORT}...`);
      });
    })
    .catch(err => {
      console.error('Failed to start local server:', err);
      process.exit(1);
    });

// Otherwise, export for Vercel (or any Lambda‐style platform)
} else {
  module.exports = universalHandler;
}
