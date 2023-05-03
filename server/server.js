const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

// Recieves card information from client and sends it back

io.on("connection", (socket) => {
  socket.on("place-card", (id, cardClass, name) => {
      io.emit("place-card", id, cardClass, name);
  });
  socket.on("bloodied-card", (cardId) => {
    io.emit("bloodied-card", cardId);
  });
  socket.on("unbloodied-card", (cardId) => {
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
