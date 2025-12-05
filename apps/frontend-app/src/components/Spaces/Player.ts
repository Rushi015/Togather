// components/spaces/Player.ts
import Character from "./Character";
import { Direction } from "./Controls";

interface PlayerConfig {
  scene: Phaser.Scene;
  position: { x: number; y: number };
  direction: Direction;
  texture: string;
  username: string; // ✅ REQUIRED
  collisionLayer?: Phaser.Tilemaps.TilemapLayer;
}

export default class Player extends Character {
  private currentDirection = Direction.DOWN;

  constructor(config: PlayerConfig) {
    super(config);
  }

  public moveCharacter(direction: Direction) {
    this.currentDirection = direction;
    this.sprite.setVelocity(0);

    const avatarKey = this.sprite.texture.key;

    if (direction === Direction.LEFT) {
      this.sprite.setVelocityX(-150);
      this.sprite.anims.play(`${avatarKey}-walk-left`, true);
    } else if (direction === Direction.RIGHT) {
      this.sprite.setVelocityX(150);
      this.sprite.anims.play(`${avatarKey}-walk-right`, true);
    } else if (direction === Direction.UP) {
      this.sprite.setVelocityY(-150);
      this.sprite.anims.play(`${avatarKey}-walk-up`, true);
    } else if (direction === Direction.DOWN) {
      this.sprite.setVelocityY(150);
      this.sprite.anims.play(`${avatarKey}-walk-down`, true);
    } else {
      const dir =
        this.currentDirection === Direction.LEFT
          ? "left"
          : this.currentDirection === Direction.RIGHT
          ? "right"
          : this.currentDirection === Direction.UP
          ? "up"
          : "down";

      this.sprite.anims.play(`${avatarKey}-idle-${dir}`, true);
    }
  }
}
