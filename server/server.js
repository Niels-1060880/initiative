const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  //   console.log(socket.id);
  socket.on("place-card", (string) => {
    console.log(string);
    socket.broadcast.emit("place-card", string);
  });
  socket.on("bloodied-card", (string) => {
    console.log(string);
    socket.broadcast.emit("bloodied-card", string);
  });
  socket.on("unbloodied-card", (string) => {
    console.log(string);
    socket.broadcast.emit("unbloodied-card", string);
  });
  socket.on("death-card", (string) => {
    console.log(string);
    socket.broadcast.emit("death-card", string);
  });
  socket.on("dragstart-card", (string) => {
    console.log(string);
    socket.broadcast.emit("dragstart-card", string);
  });
  socket.on("dragdrop-card", (string) => {
    console.log(string);
    socket.broadcast.emit("dragdrop-card", string);
  });
  socket.on('new-round', string => {
    console.log(string);
    socket.broadcast.emit('new-round', string)
  })
});
