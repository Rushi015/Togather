"use client"

import ChatForm from "../../components/ChatForm"
import { useEffect } from "react";
import { useGameStore } from "@/stores/useGameStore";
export default function createRoomPage() {
  const resetStore = useGameStore((s) => s.resetStore);

  useEffect(() => {
    resetStore(); // 👈 NEW: CLEAR OLD DATA EVERY TIME
  }, []);

  return <ChatForm />;
}