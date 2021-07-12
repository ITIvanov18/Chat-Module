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