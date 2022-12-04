"use strict";

var _regeneratorRuntime = _interopRequireDefault(require("regenerator-runtime"));
var _http = _interopRequireDefault(require("http"));
var _socket = require("socket.io");
var _adminUi = require("@socket.io/admin-ui");
require("dotenv/config");
require("./db");
require("./models/Video");
require("./models/User");
require("./models/Comment");
var _server = _interopRequireDefault(require("./server"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var PORT = 4900;
var server = _http["default"].createServer(_server["default"]);
var io = new _socket.Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true
  }
});
(0, _adminUi.instrument)(io, {
  auth: false
});
var publicRooms = function publicRooms() {
  var _io$sockets$adapter = io.sockets.adapter,
    rooms = _io$sockets$adapter.rooms,
    sids = _io$sockets$adapter.sids;
  var publicRooms = [];
  rooms.forEach(function (_, key) {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
};
var countRoom = function countRoom(roomName) {
  var _io$sockets$adapter$r;
  return (_io$sockets$adapter$r = io.sockets.adapter.rooms.get(roomName)) === null || _io$sockets$adapter$r === void 0 ? void 0 : _io$sockets$adapter$r.size;
};
io.on("connection", function (socket) {
  socket["nickname"] = "Anon";
  socket.onAny(function (event) {
    // console.log(io.sockets);
    // console.log(io.sockets.adapter);
    console.log(event);
  });
  socket.on("enter_room", function (messageRoom, nickName, callback) {
    socket["nickname"] = nickName;
    socket.join(messageRoom);
    callback();
    socket.to(messageRoom).emit("welcome", socket.nickname, countRoom(messageRoom));
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", function () {
    socket.rooms.forEach(function (room) {
      socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1);
    });
  });
  socket.on("disconnect", function () {
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("new_message", function (message, room, callback) {
    socket.to(room).emit("new_message", "".concat(socket.nickname, " : ").concat(message));
    callback();
  });
  socket.on("nickname", function (nickname) {
    socket["nickname"] = nickname;
  });
  socket.on("videojoin_room", function (roomName) {
    // console.log(roomName);
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", function (offer, roomName) {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", function (answer, roomName) {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", function (ice, roomName) {
    socket.to(roomName).emit("ice", ice);
  });
});
server.listen(PORT, function () {
  return console.log("Zeragae Server http://localhost:".concat(PORT));
});