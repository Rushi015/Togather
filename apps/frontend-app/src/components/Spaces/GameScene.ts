// components/spaces/GameScene.ts
import * as Phaser from "phaser";
import Player from "./Player";
import RemotePlayer from "./RemotePlayer";
import { Controls, Direction } from "./Controls";
import { io, Socket } from "socket.io-client";
import { useGameStore } from "@/stores/useGameStore";

type InitData = {
  roomId: string;
  username: string;
  avatar: string;
};

type ExistingUser = {
  id: string;
  username: string;
  avatar: string;
  position: { x: number; y: number };
};

export class GameScene extends Phaser.Scene {
  public socket!: Socket;
  private player!: Player;
  private controls!: Controls;
  private remotePlayers: Map<string, RemotePlayer> = new Map();

  // populated in init()
  private roomId: string = "default-room";
  private username: string = "anon";
  private avatar: string = "adam";

  constructor() {
    super({ key: "GameScene" });
  }

  // Phaser calls init with the data you pass to scene.start(...)
  init(data: InitData) {
    if (data?.roomId) this.roomId = data.roomId;
    if (data?.username) this.username = data.username;
    if (data?.avatar) this.avatar = data.avatar;
  }

  preload() {
    this.load.tilemapTiledJSON("map", "/assets/map.json");
    this.load.image("background", "/assets/background.png");
    this.load.image("foreground", "/assets/foreground.png");
    this.load.image("collision", "/assets/collision.png");

    ["adam", "ash", "lucy", "nancy"].forEach((avatar) => {
      this.load.spritesheet(avatar, `/assets/character/${avatar}.png`, {
        frameWidth: 32,
        frameHeight: 48,
      });
    });
  }

  create() {
    // Map & layers
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("collision", "collision") as Phaser.Tilemaps.Tileset;
    const collisionLayer = map.createLayer("collision", tileset, 0, 0) as Phaser.Tilemaps.TilemapLayer;
    if (collisionLayer) collisionLayer.setCollision([3953, 3954, 3955, 3956]);

    this.add.image(0, 0, "background").setOrigin(0).setDepth(0);

    // animations first
    this.createAnimations();

    // create player
 this.player = new Player({
  scene: this,
  position: { x: 400, y: 300 },
  direction: Direction.DOWN,
  texture: this.avatar,
  username: this.username,   // ✔ added
  collisionLayer,
});


    this.physics.add.collider(this.player.getSprite(), collisionLayer || undefined);

    // camera
    this.cameras.main.startFollow(this.player.getSprite());
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);

    // controls
    this.controls = new Controls(this);

    // socket setup
const WS_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8000"
    : "http://localhost:8000";

this.socket = io(WS_URL, { transports: ["websocket"] });

    // attach to the store so Chat can use it (single socket architecture)
    this.socket.on("connect", () => {
      useGameStore.getState().setSocket(this.socket);

      // join the intended room on server
      this.socket.emit("join-room", this.roomId, {
        username: this.username,
        avatar: this.avatar,
        position: { x: this.player.getSprite().x, y: this.player.getSprite().y },
      });
    });

    // receive existing users in same room
    this.socket.on("existing-users", (users: ExistingUser[]) => {
      users.forEach((u) => {
        if (u.id === this.socket.id) return;
        if (this.remotePlayers.has(u.id)) return;

        const remote = new RemotePlayer(this, u.id, u.username, u.avatar, u.position.x, u.position.y);
        this.remotePlayers.set(u.id, remote);
      });
    });

    // new user joined
    this.socket.on("user-joined", (u: ExistingUser) => {
      if (u.id === this.socket.id) return;
      if (this.remotePlayers.has(u.id)) return;
      const remote = new RemotePlayer(this, u.id, u.username, u.avatar, u.position.x, u.position.y);
      this.remotePlayers.set(u.id, remote);
    });

    // player move inside this room
    this.socket.on("player-move", (payload: any) => {
      const { playerId, position, animation } = payload;
      if (playerId === this.socket.id) return;
      const remote = this.remotePlayers.get(playerId);
      if (remote) {
        remote.updatePosition(position.x, position.y, animation.direction, animation.isMoving);
      }
    });

    this.socket.on("chat-history", (history) => {
  const set = useGameStore.getState();
  history.forEach((m: any) => set.addMessage(m));   // ⭐ Load history into store
});

    // chat messages for this room
    this.socket.on("chat-message", (msg: any) => {
      useGameStore.getState().addMessage(msg);
    });

    // user left room
    this.socket.on("user-left", (id: string) => {
      const r = this.remotePlayers.get(id);
      if (r) {
        r.destroy();
        this.remotePlayers.delete(id);
      }
    });

    // cleanup socket when Phaser shuts down this scene
    this.events.on("shutdown", () => {
      try {
        if (this.socket && this.socket.connected) {
          this.socket.disconnect();
        }
      } catch (e) {
        // ignore
      }
    });

    this.events.on("destroy", () => {
      try {
        if (this.socket && this.socket.connected) {
          this.socket.disconnect();
        }
      } catch (e) {}
    });

    // foreground layer drawn after players so players appear between bg & fg
    this.add.image(0, 0, "foreground").setOrigin(0).setDepth(10);
  }

  update() {
    const direction = this.controls.getDirectionKeyPressed();

    this.player.moveCharacter(direction);
    this.player.update();

    // emit only when moved
    if (this.player.hasMoved()) {
      const sprite = this.player.getSprite();
      const animState = this.player.getAnimationState();

      this.socket.emit("player-move", {
        roomId: this.roomId,
        playerId: this.socket.id,
        position: { x: sprite.x, y: sprite.y },
        animation: {
          direction: animState.direction,
          isMoving: animState.isMoving,
        },
      });
    }

    // update remote players interpolation
    this.remotePlayers.forEach((p) => p.update());
  }

  private createAnimations() {
    const avatars = ["adam", "ash", "lucy", "nancy"];
    avatars.forEach((avatar) => {
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
        frames: this.anims.generateFrameNumbers(avatar, { start: 30, end: 35 }),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.create({
        key: `${avatar}-idle-down`,
        frames: [{ key: avatar, frame: 18 }],
        frameRate: 1,
      });
      this.anims.create({
        key: `${avatar}-idle-up`,
        frames: [{ key: avatar, frame: 6 }],
        frameRate: 1,
      });
      this.anims.create({
        key: `${avatar}-idle-left`,
        frames: [{ key: avatar, frame: 12 }],
        frameRate: 1,
      });
      this.anims.create({
        key: `${avatar}-idle-right`,
        frames: [{ key: avatar, frame: 0 }],
        frameRate: 1,
      });
    });
  }
}
