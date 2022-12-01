const socket = io();

const welcome = document.getElementById("welcomeChat");
const welcomeForm = document.getElementById("welcomeForm");
const messageRoom = document.getElementById("messageRoom");

messageRoom.hidden = true;
let roomName;

const addMessage = (message) => {
  const ul = messageRoom.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = messageRoom.querySelector("#messageRoomForm input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
};
const handleNickNameSubmit = (event) => {
  event.preventDefault();
  const input = messageRoom.querySelector("#messagNameRoomForm input");
  socket.emit("nickname", input.value);
};

const showRoom = () => {
  welcome.hidden = true;
  messageRoom.hidden = false;
  const h3 = document.createElement("h3");
  messageRoom.prepend(h3);
  h3.innerText = `Room ${roomName}`;
  const messageForm = messageRoom.querySelector("#messageRoomForm");
  const nameForm = messageRoom.querySelector("#messagNameRoomForm");
  messageForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNickNameSubmit);
};
const newCount = (count) => {
  console.log(count);
  // const h2 = document.createElement("h2");
  const h3 = messageRoom.querySelector("h3");
  h3.innerText = `Room ${roomName} (${count})`;
  messageRoom.appendChild(h3);
};

const handleRoomSubmit = (event) => {
  event.preventDefault();
  // const input = welcomeForm.querySelector("input");
  const roomNameInput = welcomeForm.querySelector("#roomName");
  const nickName = welcomeForm.querySelector("#nickName");

  // const value = input.value;
  socket.emit("enter_room", roomNameInput.value, nickName.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  const changeNickNameInput = messageRoom.querySelector("input");
  changeNickNameInput.input = nickName.input;
};

welcomeForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newcount) => {
  newCount(newcount);
  addMessage(`${user} : joined!`);
});
socket.on("bye", (left, newcount) => {
  newCount(newcount);
  addMessage(`${left} left !`);
});
socket.on("new_message", (message) => {
  addMessage(message);
});
socket.on("room_change", (rooms) => {
  // console.log(rooms);
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";

  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    console.log(room);
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  });
});
