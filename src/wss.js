import wss from "./init";

wss.on("connection", (socket) => {
  socket.send("hello");
});
