const messageForm = document.getElementById("chatForm");
const nickForm = document.getElementById("nickForm");
const messageList = document.getElementById("chatList");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const message = { type, payload };
  console.log(message);
  return JSON.stringify(message);
}

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});
socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  messageList.appendChild(li);
  li.innerText = message.data;
});
socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

const handleSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  const li = document.createElement("li");
  const value = input.value;
  messageList.appendChild(li);
  li.innerText = `You: ${value}`;

  socket.send(makeMessage("new_message", value));
  input.value = "";
};

const handleNickSubmit = (event) => {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  const value = input.value;
  socket.send(makeMessage("nick_name", value));
  input.value = "";
};

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
