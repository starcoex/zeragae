import http from "http";
import WebSocket from "ws";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4900;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nick_name"] = "Anon";
  socket.on("close", () => console.log("Disconnected from the Browser"));
  socket.on("message", (message) => {
    console.log(message.toString());
    // socket.send(message.toString());
    const parsed = JSON.parse(message);
    console.log(parsed);
    if (parsed.type === "new_message") {
      sockets.forEach((socket) => {
        socket.send(`${socket.nick_name} : ${parsed.payload} `);
      });
    } else if (parsed.type === "nick_name") {
      socket["nick_name"] = parsed.payload;
      console.log(socket);
    }
  });
  // socket.send("Hello");
});

server.listen(PORT, () =>
  console.log(`Zeragae Server http://localhost:${PORT}`)
);

export default wss;
