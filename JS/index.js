const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 6969;
const path = require('path');
const { joinUser, removeUser } = require('./users');

app.get('/', (req, res) => {
    const index = path.join(__dirname, '/../HTML', '.', '/index.html');
    res.sendFile(index);
});

http.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});