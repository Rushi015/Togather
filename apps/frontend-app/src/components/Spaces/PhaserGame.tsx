"use client";

import React, { useEffect, useRef } from "react";
import * as Phaser from "phaser";
import { GameScene } from "./GameScene";
import { useGameStore } from "@/stores/useGameStore";

type Props = {
  roomId: string;
  username: string;
  avatar: string;
};

const PhaserGame: React.FC<Props> = ({ roomId }) => {
  const gameRef = useRef<HTMLDivElement | null>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  const username = useGameStore((s) => s.username);
  const avatar = useGameStore((s) => s.avatar);

  useEffect(() => {
    if (!roomId || !username || !avatar) {
      console.warn("Waiting for username/avatar/roomId");
      return;
    }

    if (!phaserGameRef.current) {
      phaserGameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: gameRef.current ?? undefined,
        width: 1200,
        height: 700,
        backgroundColor: "#3498db",
        physics: {
          default: "arcade",
          arcade: { debug: false },
        },
        scene: [GameScene],
      });

      // Now start the scene with your data
      phaserGameRef.current.scene.start("GameScene", {
        roomId,
        username,
        avatar,
      });
    }

    return () => {
      if (phaserGameRef.current) {
        const scene = phaserGameRef.current.scene.getScene("GameScene") as any;
        if (scene?.socket) scene.socket.disconnect();

        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [roomId, username, avatar]);

  return <div ref={gameRef} className="h-full w-full" />;
};

export default PhaserGame;
