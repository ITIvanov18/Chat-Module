const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
  joinUser,
  getCurrentUser,
  removeUser,
  getRoomUsers
} = require('./users');

const port = process.env.PORT || 6969;

app.get('/', (req, res) => {
    const index = path.join(__dirname, '/../HTML', '.', '/index.html');
    res.sendFile(index);
});

var room="";
io.on("connection",(socket)=>{
    console.log("connected");
    socket.on("join",(data)=>{
        console.log("in room "+data.roomName);
        let newUser = joinUser(socket.id,data.username,data.roomName);
        socket.emit("IUR socket", {
            id:socket.id,
            username:newUser.username,
            roomName: newUser.roomname
        });
        room = newUser.roomname;
        console.log(newUser);
        socket.join(newUser.roomname);
    });
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});