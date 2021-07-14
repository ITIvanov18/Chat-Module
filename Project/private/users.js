let users = [];
function joinUser(socketId, userName, roomName) {
  const user =
  {
    socketID: socketId,
    username: userName,
    room: roomName,
  }
  users.push(user)
  return user
}

function getCurrentUser(idsocket) {
  return users.find(user =>{ user.id === idsocket});
}

function removeUser(id) {
  const getID = users => users.socketID === id;
  const index = users.findIndex(getID);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}
module.exports = {
  joinUser,
  getCurrentUser,
  removeUser,
  getRoomUsers
};