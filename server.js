const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot';

// Run when a client connects
io.on('connection', socket => {

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!')); // it will emit to single connected user

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined a chat')); // it will emit to every body except the connected user

    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat')); // it will emit to every user
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    })

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));