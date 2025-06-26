import * as Phaser from 'phaser';
import Player from './Player';
import RemotePlayer from './RemotePlayer';
import { Controls, Direction } from './Controls';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '@/stores/useGameStore';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private controls!: Controls;
  private socket!: Socket;
  private remotePlayers: Map<string, RemotePlayer> = new Map();
  private selectedAvatar: string = 'adam';
  private roomId: string = 'default-room';

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.tilemapTiledJSON('map', '/assets/map.json');
    this.load.image('background', '/assets/background.png');
    this.load.image('foreground', '/assets/foreground.png');
    this.load.image('collision', '/assets/collision.png');

    ['adam', 'ash', 'lucy', 'nancy'].forEach((avatar) => {
      this.load.spritesheet(avatar, `/assets/character/${avatar}.png`, {
        frameWidth: 32,
        frameHeight: 48,
      });
    });

    const { avatar, room } = useGameStore.getState();
    this.selectedAvatar = avatar || 'adam';
    this.roomId = room || 'default-room';
  }

  create() {
    // Create map & layers
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('collision', 'collision');
    const collisionLayer = map.createLayer('collision', tileset, 0, 0);
    collisionLayer?.setCollision([3953, 3954, 3955, 3956]);

    this.add.image(0, 0, 'background').setOrigin(0);

    // Create local player
    this.player = new Player({
      scene: this,
      position: { x: 400, y: 300 },
      direction: Direction.DOWN,
      texture: this.selectedAvatar,
    });

    this.physics.add.collider(this.player.getSprite(), collisionLayer);
    this.cameras.main.startFollow(this.player.getSprite());
    this.add.image(0, 0, 'foreground').setOrigin(0);

    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    // Animations
    ['adam', 'ash', 'lucy', 'nancy'].forEach((avatar) => {
      this.anims.create({
        key: `${avatar}-walk-down`,
        frames: this.anims.generateFrameNumbers(avatar, { start: 42, end: 47 }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: `${avatar}-walk-left`,
        frames: this.anims.generateFrameNumbers(avatar, { start: 36, end: 41 }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: `${avatar}-walk-right`,
        frames: this.anims.generateFrameNumbers(avatar, { start: 24, end: 29 }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: `${avatar}-walk-up`,
        frames: this.anims.generateFrameNumbers(avatar, { start: 6, end: 11 }),
        frameRate: 8,
        repeat: -1,
      });
    });

    // Controls
    this.controls = new Controls(this);

    // Connect socket
    this.socket = io('http://localhost:8000');

    this.socket.on('connect', () => {
      const { username, avatar } = useGameStore.getState();
      this.socket.emit('join-room', this.roomId, {
        id: this.socket.id,
        username,
        avatar,
        position: { x: 400, y: 300 },
      });
    });

    // Only add other users, not self
    // this.socket.on('existing-users', (users) => {
    //   for (const user of users) {
    //     if (user.id === this.socket.id) continue;
    //     const remote = new RemotePlayer(
    //       this,
    //       user.id,
    //       user.username,
    //       user.avatar,
    //       user.position.x,
    //       user.position.y
    //     );
    //     this.remotePlayers.set(user.id, remote);
    //   }
    // });

 this.socket.on('existing-users', (users) => {
  for (const data of users) {
    if (data.id === this.socket.id) continue; // ✅ Skip yourself
    if (this.remotePlayers.has(data.id)) continue;

    const remotePlayer = new RemotePlayer(
      this,
      data.id,
      data.username,
      data.avatar,
      data.position.x,
      data.position.y
    );

    this.remotePlayers.set(data.id, remotePlayer);
  }
});


    this.socket.on('user-joined', (data) => {
  if (data.id === this.socket.id) return; // ✅ Don't create a remote player for yourself

  // Prevent creating duplicate RemotePlayers
  if (this.remotePlayers.has(data.id)) return;

  const remotePlayer = new RemotePlayer(
    this,
    data.id,
    data.username,
    data.avatar,
    data.position.x,
    data.position.y
  );

  this.remotePlayers.set(data.id, remotePlayer);
});


    this.socket.on('player-move', ({ playerId, position, animation }) => {
      //if (playerId === this.socket.id) return; // ignore self
      const remote = this.remotePlayers.get(playerId);
      if (remote) {
        remote.updatePosition(
          position.x,
          position.y,
          animation.direction,
          animation.isMoving
        );
      }
    });

    this.socket.on('user-left', (id: string) => {
      const remote = this.remotePlayers.get(id);
      if (remote) {
        remote.destroy();
        this.remotePlayers.delete(id);
      }
    });
  }

  update() {
    const direction = this.controls.getDirectionKeyPressed();
    this.player.moveCharacter(direction);
    this.player.update();

    const sprite = this.player.getSprite();
    this.socket.emit('player-move', {
      roomId: this.roomId,
      playerId: this.socket.id,
      position: { x: sprite.x, y: sprite.y },
      animation: {
        direction: Direction[direction].toLowerCase(),
        isMoving: direction !== Direction.NONE,
      },
    });

    this.remotePlayers.forEach((remote) => remote.update());
  }
}
