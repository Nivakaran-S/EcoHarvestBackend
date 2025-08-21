
const http = require('http');
const app = require('./src/app')
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 8000;

const MONGO_URL = process.env.MONGO_URL;


// This way of listening not only helps to listen to HTTP requests but also other types of connections(websockets, send request and wait for the respoonse)
const server = http.createServer(app);


const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

io.on('connection', (socket) => {
    const {id, role} = socket.handshake.query;
    console.log('A user connected', id, role)
})



// Emits events when the connection is ready
mongoose.connection.once('open', () => {
    console.log('MongoDB connection is ready!!')
})


//Checking for mongoDB errors
mongoose.connection.on('error', (err) => {
   console.log('Error connecting with MongoDB: ',err)  
})

async function startServer() {
   await mongoose.connect(MONGO_URL)    

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`)
    })
    
}

startServer()
