var roomName = document.getElementById('roomId');
var userList = document.getElementById('users');
const queryString = window.location.search;

const urlParams=new URLSearchParams(queryString)
// Get username and room from URL
var userName = urlParams.get('username');
var roomId = urlParams.get('roomId');

console.log("username "+userName);
console.log("room id: "+roomId);

var socket = io();
socket.emit("join", {
    username: userName,
    room: roomId
});

// Get room and users
socket.on('roomUsers', ({ room, currentUsers }) => {
    outputRoomName(room);
    outputUsers(currentUsers);
  });


// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}
// Add users to DOM
function outputUsers(currentUsers) {
  userList.innerHTML = '';
  currentUsers.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}