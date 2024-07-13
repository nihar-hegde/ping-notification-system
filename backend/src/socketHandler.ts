import { Server, Socket } from "socket.io";

const connectedUsers = new Map();

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join", (userId: string) => {
      connectedUsers.set(socket.id, userId);
      io.emit("userJoined", { userId, socketId: socket.id });
      io.emit("userList", Array.from(connectedUsers.values()));
    });

    socket.on("ping", ({ to, from }) => {
      if (to === "all") {
        io.emit("notification", { from, message: "Pinged all users" });
      } else {
        const recipientSocketId = Array.from(connectedUsers.entries()).find(
          ([_, userId]) => userId === to
        )?.[0];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("notification", {
            from,
            message: "Pinged you",
          });
        }
      }
    });

    socket.on("disconnect", () => {
      const userId = connectedUsers.get(socket.id);
      connectedUsers.delete(socket.id);
      io.emit("userLeft", userId);
      io.emit("userList", Array.from(connectedUsers.values()));
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
