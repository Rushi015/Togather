'use client'

import React, { useEffect, useRef } from 'react'
import * as Phaser from 'phaser';
import { GameScene } from './GameScene'

const PhaserGame: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null)
  const phaserGameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!phaserGameRef.current) {
      phaserGameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        parent: gameRef.current!,
        width: 1100,
        height: 700,
        backgroundColor: '#3498db',
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
        scene: [GameScene],
      })
    }

    return () => {
      phaserGameRef.current?.destroy(true)
      phaserGameRef.current = null
    }
  }, [])

  return <div ref={gameRef} className=" h-full" />
}

export default PhaserGame
