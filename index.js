const express = require("express");
const http = require("http");

const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket) => {
    socket.on('msg_send', (data) => {
      console.log(data);
      io.emit('msg_recv', data);
      // socket.emit('msg_recv', data); //all connect clients
  })
 

});
app.use("/", express.static(__dirname + "/public"));
server.listen(3000, () => {
  console.log("Server started on port 3000");
});
