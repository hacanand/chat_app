const express = require("express");
const http = require("http");
const connect = require("./config/database-config");
const Chat = require("./models/chat");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data.roomId, function () {
      console.log("joined a room ", data.roomId);
    });
  });
  socket.on("msg_send", async (data) => {
    const chat = await Chat.create({
      content: data.msg,
      user: data.username,
      roomId: data.roomId,
    });
    io.to(data.roomId).emit("msg_recv", data);
    // socket.emit('msg_recv', data); //all connect clients
  });
});
app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/public"));
app.get("/chat/:roomId",async (req, res) => {
  const chats=await Chat.find({roomId:req.params.roomId}).select('content user');
  res.render("index", {
    name: "anand",
    roomId: req.params.roomId,
    chats:chats
  });
});
server.listen(3000, async () => {
  console.log("Server started on port 3000");
  await connect();
  console.log("Database connected");
});
