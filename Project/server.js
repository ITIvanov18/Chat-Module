const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./private/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
  joinUser,
  getCurrentUser,
  removeUser,
  getRoomUsers
} = require('./private/users');

const port = process.env.PORT || 6969;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/public/HTML/index.html');
});

var room="";
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
      const user = userJoin(socket.id, username, room);
   
      socket.join(user.room);
   
      // Broadcast when a user connects
      socket.broadcast
        .to(user.room)
        .emit(
          'message',
          formatMessage(' ', '${user.username} has joined the chat')
        );
   
    // Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    });
   
    // Listen for chatMessage
    socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
   
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
   
    // Runs when client disconnects
    socket.on('disconnect', () => {
      const user = userLeave(socket.id);
   
      if (user) {
        io.to(user.room).emit(
          'message',
          formatMessage(' ', '${user.username} has left the chat')
        );
   
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room)
        });
      }
    });
  });

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});