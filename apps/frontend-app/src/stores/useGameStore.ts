import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Socket } from "socket.io-client";

type ChatMessage = {
  user: string;
  message: string;
};

interface GameState {
  username: string;
  avatar: string;
  room: string;
  socket: Socket | null;
  messages: ChatMessage[];

  setUserInfo: (data: { username: string; avatar: string; room: string }) => void;
  setSocket: (socket: Socket | null) => void;
  addMessage: (msg: ChatMessage) => void;

  resetStore: () => void; // 👈 NEW
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      username: "",
      avatar: "",
      room: "",
      socket: null,
      messages: [],

      setUserInfo: ({ username, avatar, room }) =>
        set({ username, avatar, room,messages:[] }),

      setSocket: (socket) => set({ socket }),

      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),

      resetStore: () =>
        set({
          username: "",
          avatar: "",
          room: "",
          socket: null,
          messages: [],
        }), // 👈 CLEAR EVERYTHING
    }),
    {
      name: "phaser-multiplayer-store",
      partialize: (state) => ({
        username: state.username,
        avatar: state.avatar,
        room: state.room,
        messages: state.messages,
      }),
    }
  )
);
