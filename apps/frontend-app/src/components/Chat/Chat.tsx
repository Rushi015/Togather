"use client";

import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/stores/useGameStore";

export default function Chat() {
  const { sendMessage, messages, connectSocket } = useGameStore();
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    connectSocket(); // 👈 Connect once on mount
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message.trim());
    setMessage("");
  };

  return (
    <div className="bg-white h-screen w-screen p-4 text-black flex flex-col">
      <h1 className="text-xl mb-4">All messages appear here</h1>

      <div className="flex-1 overflow-y-auto border p-4 rounded-md bg-gray-100 space-y-2">
        {messages && messages.length > 0 ? (
          
          messages.map((msg, idx) => (
            <div key={idx} className="bg-white p-2 rounded shadow text-sm">
              <strong>{msg.user || "Unknown"}:</strong> {msg.message || ""}
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
