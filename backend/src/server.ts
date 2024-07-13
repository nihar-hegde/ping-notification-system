import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { authenticateToken, register, login } from "./auth";
import { setupSocketHandlers } from "./socketHandler";
import { openDb } from "./db";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.post("/register", register);
app.post("/login", login);

// Protected routes
app.use(authenticateToken);

// Socket.io setup
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

// Initialize database and start server
async function startServer() {
  try {
    await openDb();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  }
}

startServer();
