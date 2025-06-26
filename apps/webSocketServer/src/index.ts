import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

interface UserData {
  id: string;
  username: string;
  avatar: string;
  position: { x: number; y: number };
}

interface PlayerMoveData {
  playerId: string;
  position: { x: number; y: number };
  animation: {
    direction: string;
    isMoving: boolean;
  };
}

interface JoinRoomData {
  username: string;
  avatar: string;
  id: string;
  position: { x: number; y: number };
}

interface ChatMessage {
  user: string;
  message: string;
}

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = new Map<string, UserData>();
const chatHistory: ChatMessage[] = [];

io.on("connection", (socket: Socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join-room", (_roomId: string, userData: JoinRoomData) => {
    users.set(socket.id, {
      id: socket.id,
      username: userData.username,
      avatar: userData.avatar,
      position: userData.position || { x: 400, y: 300 },
    });

    // Send existing users
    const existingUsers = Array.from(users.entries())
      .filter(([id]) => id !== socket.id)
      .map(([id, data]) => ({ id, ...data }));
    socket.emit("existing-users", existingUsers);

    // Send chat history
    socket.emit("chat-history", chatHistory);

    // Notify others
    socket.broadcast.emit("user-joined", {
      id: socket.id,
      ...userData,
      position: userData.position || { x: 400, y: 300 },
    });
  });

  socket.on("player-move", (data: PlayerMoveData) => {
    if (!users.has(socket.id)) return;
    users.get(socket.id)!.position = data.position;

    socket.broadcast.emit("player-move", {
      playerId: socket.id,
      position: data.position,
      animation: data.animation,
    });
  });

  socket.on("chat-message", ({ user, message }) => {
    const msg: ChatMessage = { user, message };
    chatHistory.push(msg);
    if (chatHistory.length > 50) chatHistory.shift();

    io.emit("chat-message", msg);
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    socket.broadcast.emit("user-left", socket.id);
    console.log("❌ User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
