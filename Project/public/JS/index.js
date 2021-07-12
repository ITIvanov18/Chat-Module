const roomName = document.getElementById('room-name');
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

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });


function outputRoomName(room) {​​​​​​​​
roomName.innerText = room;
}​​​​​​​​

function outputUsers(users) {​​​​​​​​
userList.innerHTML = '';
users.forEach((user) => {​​​​​​​​
constli = document.createElement('li');
li.innerText = user.username;
userList.appendChild(li);
  }​​​​​​​​);
}​​​​​​​​

