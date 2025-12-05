"use client";

import dynamic from "next/dynamic";
import { useParams,useSearchParams } from "next/navigation";
import Chat from "@/components/Chat/Chat";

// Lazy load Phaser
const PhaserGame = dynamic(() => import("@/components/Spaces/PhaserGame"), {
  ssr: false,
});

export default function SpacePage() {
  const params = useParams();
  const query = useSearchParams();
  const roomId = params.roomId as string;
const username = query.get("name") || "anon";
  const avatar = query.get("avatar") || "adam";
  if (!roomId) {
    return <div>Error: No roomId in URL.</div>;
  }

  return (
    <div className="flex w-full h-screen">
      <PhaserGame roomId={roomId} username={username} avatar={avatar} />
      <Chat />
    </div>
  );
}
