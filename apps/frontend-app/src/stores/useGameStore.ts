import { create } from "zustand";
import { io, Socket } from "socket.io-client";

type ChatMessage = {
  user: string;
  message: string;
  timestamp?: string;
};

type GameState = {
  username: string;
  avatar: string;
  room: string;
  socket: Socket | null;
  messages: ChatMessage[];

  setUserInfo: (data: { username: string; avatar: string; room: string }) => void;
  sendMessage: (msg: string) => void;
  connectSocket: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  username: "",
  avatar: "",
  room:"" ,// 🔒 Hardcoded room
  socket: null,
  messages: [],

  setUserInfo: ({ username, avatar,room }) =>
    set({ username, avatar,room }),

  sendMessage: (msg) => {
    const { socket, username, room } = get();
    if (!socket || !msg.trim()) return;

    socket.emit("chat-message", {
      roomId: room,
      user: username,
      message: msg,
    });
  },

  connectSocket: () => {
    const { socket, room, username, avatar } = get();

    if (socket || !room || !username || !avatar) return;

    const newSocket = io("http://localhost:8000");

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");

      newSocket.emit("join-room", room, {
        id: newSocket.id,
        username,
        avatar,
      });

      console.log("🟢 join-room sent", { room, username, avatar });
    });

    newSocket.on("chat-message", (msg: ChatMessage) => {
      console.log("📩 New chat message:", msg);
      set((state) => ({
        messages: [...state.messages, msg],
      }));
    });

    newSocket.on("chat-history", (history: ChatMessage[]) => {
      set({ messages: history });
    });

    set({ socket: newSocket });
  },
}));
