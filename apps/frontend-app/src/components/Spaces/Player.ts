import Character from './Character'
import { Direction } from './Controls'

interface PlayerConfig {
  scene: Phaser.Scene
  position: { x: number; y: number }
  direction: Direction
   texture: string
  collisionLayer?: Phaser.Tilemaps.TilemapLayer
} 

export default class Player extends Character {
  constructor(config: PlayerConfig) {
    super(config)
  }
}
