"use client";

import Chat from "@/components/Chat/Chat";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useGameStore } from "@/stores/useGameStore";

// Lazy load Phaser game
const PhaserGame = dynamic(() => import("@/components/Spaces/PhaserGame"), {
  ssr: false,
});

export default function SpacesPage() {
  const { username, avatar, room, connectSocket } = useGameStore();

  useEffect(() => {
    if (!username || !room || !avatar) {
      console.warn("Missing user info, cannot connect socket");
      return;
    }

    connectSocket(); // Zustand handles all socket logic

    return () => {
      // Optional: add disconnect logic in Zustand if needed
    };
  }, [username, room, avatar]);

  return (
    <div className="flex flex-row">
      <PhaserGame />
      <Chat />
    </div>
  );
}
