import * as Phaser from 'phaser';
import { Direction } from './Controls'
import { useGameStore } from '@/stores/useGameStore'
interface CharacterConfig {
  scene: Phaser.Scene
  position: { x: number; y: number }
  direction: Direction
  texture: string
  collisionLayer?: Phaser.Tilemaps.TilemapLayer
}

export default class Character {
  protected scene: Phaser.Scene
  protected sprite: Phaser.Physics.Arcade.Sprite
  protected direction: Direction
  protected collisionLayer?: Phaser.Tilemaps.TilemapLayer
   private nameText: Phaser.GameObjects.Text;




  constructor(config: CharacterConfig) { 
    this.scene = config.scene
    this.direction = config.direction
    this.collisionLayer = config.collisionLayer

    // Create the character sprite
    this.sprite = this.scene.physics.add.sprite(config.position.x, config.position.y, config.texture)
   //this.scene.physics.world.enable(this.sprite)
    this.sprite.setCollideWorldBounds(true) // Prevent leaving the game world

    // Enable collision if a collision layer is provided
    if (this.collisionLayer) {
      this.scene.physics.add.collider(this.sprite, this.collisionLayer)
      this.collisionLayer.setCollisionByProperty({ collides: true }) // Ensure tile collision is enabled

    }
    this.createPlayerAnimations()


    const { username } = useGameStore.getState();
this.nameText = this.scene.add.text(0, 0, username, {
  fontSize: '12px',
  color: '#ffffff',
  stroke: '#000000',
  strokeThickness: 3,
}).setOrigin(0.5, 1); 

     
  }
  public getSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite
  }  

  public update() {
    // This method updates the name text position relative to the sprite
    this.nameText.setPosition(this.sprite.x, this.sprite.y - 20);
  }

  private createPlayerAnimations() {
    const anims = this.scene.anims
    const animsFrameRate = 15
 // Adjust as needed

    anims.create({
      key: 'adam_idle_right',
      frames: anims.generateFrameNumbers('adam', { start: 0, end: 5 }),
      repeat: -1,
      frameRate: animsFrameRate * 0.6
    })

    anims.create({
      key: 'ash_idle_right',
      frames: anims.generateFrameNumbers('ash', { start: 0, end: 5 }),
      repeat: -1,
      frameRate: animsFrameRate * 0.6
    })

    anims.create({
      key: 'adam_idle_up',
      frames: anims.generateFrameNumbers('adam', { start: 6, end: 11 }),
      repeat: -1,
      frameRate: animsFrameRate * 0.6
    })

     anims.create({
      key: 'ash_idle_up',
      frames: anims.generateFrameNumbers('ash',{ start: 6, end: 11 }),
      repeat: -1,
      frameRate: animsFrameRate * 0.6
    })

    anims.create({
      key: 'adam_idle_left',
      frames: anims.generateFrameNumbers('adam', { start: 12, end: 17 }),
      repeat: -1,
      frameRate: animsFrameRate * 0.6
    })

    anims.create({
      key: 'ash_idle_left',
      frames: anims.generateFrameNumbers('ash', { start: 12, end: 17 }),
      repeat: -1,
      frameRate: animsFrameRate * 0.6
    })

    anims.create({
      key: 'adam_idle_down',
      frames: anims.generateFrameNumbers('adam', { start: 18, end: 23 }),
      repeat: -1,
      frameRate: animsFrameRate * 0.6
    })

     anims.create({
      key: 'ash_idle_down',
      frames: anims.generateFrameNumbers('ash', { start: 18, end: 23 }),
      repeat: -1,
      frameRate: animsFrameRate * 0.6
    })

    anims.create({
      key: 'adam_run_right',
      frames: anims.generateFrameNumbers('adam', { start: 24, end: 29 }),
      repeat: -1,
      frameRate: animsFrameRate
    })

     anims.create({
      key: 'ash_run_right',
      frames: anims.generateFrameNumbers('ash', { start: 24, end: 29 }),
      repeat: -1,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'ash_run_up',
      frames: anims.generateFrameNumbers('ash', { start: 30, end: 35 }),
      repeat: -1,
      frameRate: animsFrameRate
    })

     anims.create({
      key: 'adam_run_up',
      frames: anims.generateFrameNumbers('adam', { start: 30, end: 35 }),
      repeat: -1,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'adam_run_left',
      frames: anims.generateFrameNumbers('adam', { start: 36, end: 41 }),
      repeat: -1,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'ash_run_left',
      frames: anims.generateFrameNumbers('ash', { start: 36, end: 41 }),
      repeat: -1,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'adam_run_down',
      frames: anims.generateFrameNumbers('adam', { start: 42, end: 47 }),
      repeat: -1,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'ash_run_down',
      frames: anims.generateFrameNumbers('ash', { start: 42, end: 47 }),
      repeat: -1,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'ash_sit_down',
      frames: anims.generateFrameNumbers('ash', { start: 48, end: 48 }),
      repeat: 0,
      frameRate: animsFrameRate
    })

     anims.create({
      key: 'ash_sit_down',
      frames: anims.generateFrameNumbers('ash', { start: 48, end: 48 }),
      repeat: 0,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'adam_sit_left',
      frames: anims.generateFrameNumbers('adam', { start: 49, end: 49 }),
      repeat: 0,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'adam_sit_right',
      frames: anims.generateFrameNumbers('adam', { start: 50, end: 50 }),
      repeat: 0,
      frameRate: animsFrameRate
    })

    anims.create({
      key: 'adam_sit_up',
      frames: anims.generateFrameNumbers('adam', { start: 51, end: 51 }),
      repeat: 0,
      frameRate: animsFrameRate
    })
  }

  // Move the character in the given direction
  public moveCharacter(direction: Direction) {

   const { avatar } = useGameStore.getState()
    
    this.direction = direction
    this.sprite.setVelocity(0)

    if (direction === Direction.LEFT) {
      this.sprite.setVelocityX(-150)
      this.sprite.anims.play(`${avatar}_run_left`, true)
    } else if (direction === Direction.RIGHT) {
      this.sprite.setVelocityX(150)
      this.sprite.anims.play(`${avatar}_run_right`, true)
    } else if (direction === Direction.UP) {
      this.sprite.setVelocityY(-150)
      this.sprite.anims.play(`${avatar}_run_up`, true)
    } else if (direction === Direction.DOWN) {
      this.sprite.setVelocityY(150)
      this.sprite.anims.play(`${avatar}_run_down`, true)
    } else {
        this.sprite.setVelocity(0)
        this.sprite.anims.stop() 
        this.playIdleAnimation() 
    }
  }
  

  private playIdleAnimation() {
    if (this.direction === Direction.LEFT) this.sprite.setFrame(12) // First frame of `adam_idle_left`
    if (this.direction === Direction.RIGHT) this.sprite.setFrame(0) // First frame of `adam_idle_right`
    if (this.direction === Direction.UP) this.sprite.setFrame(6) // First frame of `adam_idle_up`
    if (this.direction === Direction.DOWN) this.sprite.setFrame(18) 
  }
  
}
