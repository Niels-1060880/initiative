const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  socket.on("place-card", (id, cardClass, name) => {
      io.emit("place-card", id, cardClass, name);
  });


  socket.on("bloodied-card", (cardId) => {
    console.log(cardId);
    io.emit("bloodied-card", cardId);
  });
  socket.on("unbloodied-card", (cardId) => {
    console.log(cardId);
    io.emit("unbloodied-card", cardId);
  });


  socket.on("death-card", (cardId) => {
    io.emit("death-card", cardId);
  });
  socket.on("dragdrop-card", (cardId) => {
    io.emit("dragdrop-card", cardId);
  });
  socket.on('reset-game', () => {
    io.emit("reset-game")
  })

});
