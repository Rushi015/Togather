// webSocketServer/src/index.ts
import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";

type UserData = {
  id: string;
  username: string;
  avatar: string;
  position: { x: number; y: number };
  roomId?: string;
};

type PlayerMoveData = {
  playerId?: string;
  roomId?: string;
  position: { x: number; y: number };
  animation: { direction: string; isMoving: boolean };
};

type JoinRoomData = {
  username: string;
  avatar: string;
  position?: { x: number; y: number };
};

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = new Map<string, UserData>(); // socketId -> UserData
const chatHistory = new Map<string, { user: string; message: string }[]>(); // per-room

io.on("connection", (socket: Socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join-room", (roomId: string, userData: JoinRoomData) => {
    if (!roomId) return;
    socket.join(roomId);
    socket.data.roomId = roomId;

    const initialPos = userData.position || { x: 400, y: 300 };
    users.set(socket.id, {
      id: socket.id,
      username: userData.username,
      avatar: userData.avatar,
      position: initialPos,
      roomId,
    });

    if (!chatHistory.has(roomId)) chatHistory.set(roomId, []);

    // send existing users only in the same room (exclude requester)
    const existingUsers = Array.from(users.values())
      .filter((u) => u.roomId === roomId && u.id !== socket.id)
      .map((u) => ({ id: u.id, username: u.username, avatar: u.avatar, position: u.position }));

    socket.emit("existing-users", existingUsers);

    // send chat history for this room
    socket.emit("chat-history", chatHistory.get(roomId) || []);

    // notify others in the room
    socket.to(roomId).emit("user-joined", {
      id: socket.id,
      username: userData.username,
      avatar: userData.avatar,
      position: initialPos,
    });

    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("player-move", (data: PlayerMoveData) => {
    const roomId = socket.data.roomId as string | undefined;
    if (!roomId) return;
    // update stored pos
    const rec = users.get(socket.id);
    if (rec) rec.position = data.position;

    socket.to(roomId).emit("player-move", {
      playerId: socket.id,
      position: data.position,
      animation: data.animation,
    });
  });

  socket.on("chat-message", ({ user, message }) => {
    const roomId = socket.data.roomId as string | undefined;
    if (!roomId) return;
    const msg = { user, message };
    const roomMsgs = chatHistory.get(roomId) || [];
    roomMsgs.push(msg);
    if (roomMsgs.length > 200) roomMsgs.shift();
    chatHistory.set(roomId, roomMsgs);

    io.to(roomId).emit("chat-message", msg);
  });

  socket.on("disconnect", (reason) => {
    const rec = users.get(socket.id);
    const roomId = socket.data.roomId as string | undefined;

    users.delete(socket.id);

    if (roomId) {
      socket.to(roomId).emit("user-left", socket.id);
    }

    console.log("❌ Socket disconnected:", socket.id, reason);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Socket server running on port ${PORT}`);
});
