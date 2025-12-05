"use client";

import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/stores/useGameStore";

export default function Chat() {
  const { username, socket, messages, addMessage } = useGameStore();
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Listen for chat messages from the shared socket
  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (msg: any) => {
      addMessage(msg);
    };

    socket.on("chat-message", handleChatMessage);

    return () => {
      socket.off("chat-message", handleChatMessage);
    };
  }, [socket]);

  // Auto-scroll chat window
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    const msg = {
      user: username ?? "Unknown",
      message: message.trim(),
    };

    socket.emit("chat-message", msg);
    setMessage("");
  };

  return (
    <div className="bg-white h-screen w-96 p-4 text-black flex flex-col border-l">
      <h1 className="text-xl mb-4">Chat</h1>

      <div className="flex-1 overflow-y-auto border p-4 rounded-md bg-gray-100 space-y-2">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div key={idx} className="bg-white p-2 rounded shadow text-sm">
              <strong>{msg.user}:</strong> {msg.message}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No messages yet</div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 border-t pt-4"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-amber-50 h-[50px] px-4 text-black border rounded"
          placeholder="Type a message"
        />
        <Button
          type="submit"
          disabled={!message.trim()}
          className="bg-black hover:bg-gray-700 text-white"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
