const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 6969;
const path = require('path');
const { joinUser, removeUser } = require('./users');
app.use(express.static('./'));
app.get('/', (req, res) => {
    const index = path.join(__dirname, '/../HTML', '.', '/index.html');
    res.sendFile(index);
});

var room="";
io.on("connection",(socket)=>{
    console.log("connected");
    socket.on("join",(data)=>{
        console.log("in room");
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

http.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});