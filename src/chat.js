import app from "./server";
import server from "./init";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

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
});

export default io;
