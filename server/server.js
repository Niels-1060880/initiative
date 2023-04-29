const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
})

io.on('connection', socket => {
    console.log(socket.id)
})












// const WebSocket = require("ws");

// const wss = new WebSocket.Server({ port: 8082 });

// wss.on("connection", ws => {
//   console.log("new client connected");

//   ws.on("message", data => {
//     console.log(`Client has send us: ${data}`);


//     ws.send(data);
//   });

//   ws.on("close", () => {
//     console.log("client has disconected");
//   });
// });
