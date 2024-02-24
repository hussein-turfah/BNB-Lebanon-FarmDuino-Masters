const { Server } = require("socket.io");

const initializeSocketIO = (server) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("itemCreated", () => {
      console.log("Item created event received");
      io.emit("itemCreated");
    });
  });


  io.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });

  console.log("Socket.IO initialized");

  // Export the io instance
  module.exports = { io };
};

module.exports = initializeSocketIO;


