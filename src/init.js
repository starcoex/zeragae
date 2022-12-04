import regeneratorRuntime from "regenerator-runtime";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4900;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(io, {
  auth: false,
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { rooms, sids },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};
const countRoom = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  socket.onAny((event) => {
    // console.log(io.sockets);
    // console.log(io.sockets.adapter);
    console.log(event);
  });
  socket.on("enter_room", (messageRoom, nickName, callback) => {
    socket["nickname"] = nickName;
    socket.join(messageRoom);
    callback();
    socket
      .to(messageRoom)
      .emit("welcome", socket.nickname, countRoom(messageRoom));
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", (message, room, callback) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${message}`);
    callback();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
  socket.on("videojoin_room", (roomName) => {
    // console.log(roomName);
    socket.join(roomName);

    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

server.listen(PORT, () =>
  console.log(`Zeragae Server http://localhost:${PORT}`)
);
