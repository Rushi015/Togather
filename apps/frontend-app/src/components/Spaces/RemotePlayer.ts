// components/spaces/RemotePlayer.ts
import * as Phaser from "phaser";

export default class RemotePlayer {
  private sprite: Phaser.GameObjects.Sprite;
  private nameText: Phaser.GameObjects.Text;

  private avatar: string;
  private username: string;

  private lastPosition = { x: 0, y: 0 };
  private targetPosition = { x: 0, y: 0 };
  private lastUpdateTime = 0;

  private currentDirection = "down";
  private isMoving = false;

  constructor(
    private scene: Phaser.Scene,
    public id: string,
    username: string,
    avatar: string,
    x: number,
    y: number
  ) {
    this.username = username;
    this.avatar = avatar;

    this.sprite = this.scene.add.sprite(x, y, avatar, 0).setDepth(5);

    this.nameText = this.scene.add
      .text(x, y - 20, username, {
        fontSize: "12px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5, 1)
      .setDepth(6);

    this.lastPosition = { x, y };
    this.targetPosition = { x, y };
  }

  updatePosition(
    x: number,
    y: number,
    direction: string,
    isMoving: boolean
  ) {
    this.lastPosition = { ...this.targetPosition };
    this.targetPosition = { x, y };
    this.lastUpdateTime = Date.now();

    this.currentDirection = direction;
    this.isMoving = isMoving;
  }

  update() {
    const now = Date.now();
    const t = Math.min(1, (now - this.lastUpdateTime) / (1000 / 60));

    const x = Phaser.Math.Linear(this.lastPosition.x, this.targetPosition.x, t);
    const y = Phaser.Math.Linear(this.lastPosition.y, this.targetPosition.y, t);

    if (this.isMoving) {
      const key = `${this.avatar}-walk-${this.currentDirection}`;
      if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim?.key !== key) {
        this.sprite.anims.play(key, true);
      }
    } else {
      // play correct idle frame (NO animation needed)
      if (this.currentDirection === "left") this.sprite.setFrame(12);
      else if (this.currentDirection === "right") this.sprite.setFrame(0);
      else if (this.currentDirection === "up") this.sprite.setFrame(6);
      else this.sprite.setFrame(18);
    }

    this.sprite.setPosition(x, y);
    this.nameText.setPosition(x, y - 20);
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }
}
