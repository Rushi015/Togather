// components/spaces/Character.ts
import * as Phaser from "phaser";
import { Direction } from "./Controls";

interface CharacterConfig {
  scene: Phaser.Scene;
  position: { x: number; y: number };
  direction: Direction;
  texture: string;
  username: string; // ✅ REQUIRED
  collisionLayer?: Phaser.Tilemaps.TilemapLayer;
}

export default class Character {
  protected scene: Phaser.Scene;
  protected sprite: Phaser.Physics.Arcade.Sprite;
  protected direction: Direction;
  protected collisionLayer?: Phaser.Tilemaps.TilemapLayer;
  private nameText: Phaser.GameObjects.Text;

  protected lastX = 0;
  protected lastY = 0;

  constructor(config: CharacterConfig) {
    this.scene = config.scene;
    this.direction = config.direction;
    this.collisionLayer = config.collisionLayer;

    this.sprite = this.scene.physics.add.sprite(
      config.position.x,
      config.position.y,
      config.texture
    );

    this.sprite.setCollideWorldBounds(true);

    if (this.collisionLayer) {
      this.scene.physics.add.collider(this.sprite, this.collisionLayer);
      this.collisionLayer.setCollisionByProperty({ collides: true });
    }

    // ✅ username now comes directly from config, not Zustand
    this.nameText = this.scene.add
      .text(config.position.x, config.position.y - 20, config.username, {
        fontSize: "12px",
        color: "#fff",
        stroke: "#000",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 1);
  }

  public getSprite() {
    return this.sprite;
  }

  public update() {
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 20);
  }

  public hasMoved(): boolean {
    const moved =
      Math.abs(this.sprite.x - this.lastX) > 1 ||
      Math.abs(this.sprite.y - this.lastY) > 1;

    this.lastX = this.sprite.x;
    this.lastY = this.sprite.y;

    return moved;
  }

  public getAnimationState() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const isMoving = Math.abs(body.velocity.x) > 0 || Math.abs(body.velocity.y) > 0;

    let direction = "down";
    if (body.velocity.y < 0) direction = "up";
    else if (body.velocity.y > 0) direction = "down";
    else if (body.velocity.x < 0) direction = "left";
    else if (body.velocity.x > 0) direction = "right";

    return { direction, isMoving };
  }
}
