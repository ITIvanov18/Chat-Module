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
    removeUser,
    getRoomUsers
} = require('./private/users');

const port = process.env.PORT || 6969;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/HTML/index.html');
});

app.get('/chat.html', (req, res) => {
    res.sendFile(__dirname + '/public/HTML/chat.html');
});

var room = "";
io.on('connection', socket => {
    console.log("connected");
    socket.on("join", ({ username, room }) => {
        console.log('in room');

        const user = joinUser(socket.id, username, room);


        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                formatMessage('system: ', `${user.username} has joined the chat`)
            );

        // Send users and room info
        socket.emit('roomUsers', {
            room: user.room,
            currentUsers: getRoomUsers(user.room)
        });
        console.log(user);
        socket.join(user.room);
    });

    // Listen for chatMessage
    socket.on('chatMessage', data => {
        io.to(data.roomId).emit('message', formatMessage(data.userName, data.msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage("", `${user.username} has left the chat`)
            );

            // Send users and room info
            socket.emit('roomUsers', {
                room: user.room,
                currentUsers: getRoomUsers(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});