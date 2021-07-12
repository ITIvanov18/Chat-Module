
    let userName = "";
    let roomName = "";
    let ID = "";
    var socket = io();
    socket.emit("join", {
        username: userName,
        roomName: roomName
    });
    //I - Id
    //U - username
    //R - room name
    socket.on("IUR socket", (data) => {
        ID = data.id;
        console.log(userName + "'s ID: " + ID);
    })