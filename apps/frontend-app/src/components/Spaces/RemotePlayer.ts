import * as Phaser from 'phaser';

export default class RemotePlayer {
  private sprite: Phaser.GameObjects.Sprite;
  private nameText: Phaser.GameObjects.Text;
  private lastPosition = { x: 0, y: 0 };
  private targetPosition = { x: 0, y: 0 };
  private lastUpdateTime = 0;
  private avatar: string;
  private currentDirection: string = 'down';
  private isMoving: boolean = false;

  constructor(
    private scene: Phaser.Scene,
    private id: string,
    private username: string,
    avatar: string,
    x: number,
    y: number
  ) {
    this.avatar = avatar;
    this.sprite = this.scene.add.sprite(x, y, avatar, 0);
    this.sprite.setOrigin(0.5, 0.5).setDepth(1);

    this.nameText = this.scene.add.text(x, y - 20, username, {
      fontSize: '12px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    }).setOrigin(0.5, 1).setDepth(2);

    this.lastPosition = { x, y };
    this.targetPosition = { x, y };
  }

  updatePosition(
    x: number,
    y: number,
    direction: string = 'down',
    isMoving: boolean = false
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

    const animKey = `${this.avatar}-walk-${this.currentDirection}`;

    if (this.isMoving) {
      if (
        !this.sprite.anims.isPlaying ||
        this.sprite.anims.currentAnim?.key !== animKey
      ) {
        this.sprite.anims.play(animKey, true);
      }
    } else {
      this.sprite.anims.stop();
      this.sprite.setFrame(0); // fallback idle
    }

    this.sprite.setPosition(x, y);
    this.nameText.setPosition(x, y - 20);
  }

  destroy() {
    this.sprite.destroy();
    this.nameText.destroy();
  }
}
