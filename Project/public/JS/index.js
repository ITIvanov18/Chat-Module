
const queryString = window.location.search;

const urlParams=new URLSearchParams(queryString)
// Get username and room from URL
let userName = urlParams.get('username');
let roomId = urlParams.get('roomId');

console.log("username "+userName);
console.log("room num: "+roomId);

var socket = io();
socket.emit("join", {
    username: userName,
    room: roomId
});
