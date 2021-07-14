var socket = io();

const chatMessages = document.getElementsByClassName('.chat-messages');
const roomName = document.getElementById('roomId');
const userList = document.getElementById('users');

// Get username and room from URL
const urlParams = new URLSearchParams(window.location.search);
const userName = urlParams.get('username');
const roomId = urlParams.get('roomId');

console.log("username " + userName);
console.log("room id: " + roomId);

socket.emit("join", {
    username: userName,
    room: roomId
});

// Get room and users
socket.on('roomUsers', (data) => {
    outputRoomName(data.room);
    outputUsers(data.currentUsers);
});


// Message from server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

let timer,
    timeoutVal = 1000; // time it takes to wait for user to stop typing in ms

const status = document.getElementById('status');
const typer = document.getElementById('msg');

typer.addEventListener('keypress', handleKeyPress);
typer.addEventListener('keyup', handleKeyUp);

// when user is pressing down on keys, clear the timeout
function handleKeyPress(e) {
    window.clearTimeout(timer);
    status.innerHTML = 'Typing...';

}

// when the user has stopped pressing on keys, set the timeout
// if the user presses on keys before the timeout is reached, then this timeout is canceled
function handleKeyUp(e) {
    window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
    timer = window.setTimeout(() => {
        status.innerHTML = ' ';
    }, timeoutVal);

}

// Message submit
document
    .getElementById('chat-form')
    .addEventListener('submit', (event) => {
        event.preventDefault();

        // Get message text
        let msg = event.target.elements.msg.value;

        msg = msg.trim();

        if (!msg) {
            return false;
        }
        console.log(msg);
        // Emit message to server
        socket.emit('chatMessage', { msg, userName, roomId });

        // Clear input
        event.target.elements.msg.value = '';
        event.target.elements.msg.focus();
    });

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');

    //Add a paragraph for user's name and time
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;

    //Append and display the message from the server with the paragraph
    div.appendChild(p);
    const paragraph = document.createElement('p');
    paragraph.classList.add('text');
    paragraph.innerText = message.text;
    div.appendChild(paragraph);
    document.querySelector('.chat-messages').appendChild(div);
}

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