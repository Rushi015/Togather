import * as Phaser from 'phaser';

// Define movement directions as an Enum
export enum Direction {
  NONE = 0,
  LEFT = 1,
  RIGHT = 2,
  UP = 3,
  DOWN = 4
} 

export  class Controls{
  private scene: Phaser.Scene
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
  private enterKey!: Phaser.Input.Keyboard.Key
  private fKey!: Phaser.Input.Keyboard.Key
  private lockPlayerInput: boolean = false
 
  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.cursorKeys = this.scene.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys
    this.enterKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER) as Phaser.Input.Keyboard.Key
    this.fKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F) as Phaser.Input.Keyboard.Key
  }

  // Lock/unlock player input (useful for cutscenes or UI interactions)
  public isInputLocked(): boolean {
    return this.lockPlayerInput
    console.log("www")
  }

  public setInputLock(lock: boolean): void {
    this.lockPlayerInput = lock
  }

  // Check if Enter key was just pressed
  public wasEnterKeyPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.enterKey)
  }

  // Check if Space key was just pressed
  public wasSpaceKeyPressed(): boolean {
    return this.cursorKeys.space ? Phaser.Input.Keyboard.JustDown(this.cursorKeys.space) : false
  }

  // Check if F key was just pressed
  public wasFKeyPressed(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.fKey)
  }

  // Get the currently pressed movement key
  public getDirectionKeyPressed(): Direction {
    if (!this.cursorKeys) return Direction.NONE

    if (this.cursorKeys.left.isDown) return Direction.LEFT
    if (this.cursorKeys.right.isDown) return Direction.RIGHT
    if (this.cursorKeys.up.isDown) return Direction.UP
    if (this.cursorKeys.down.isDown) return Direction.DOWN

    return Direction.NONE
  }

  // Get the movement key that was just pressed
  public getDirectionKeyJustPressed(): Direction {
    if (!this.cursorKeys) return Direction.NONE

    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.left)) return Direction.LEFT
    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.right)) return Direction.RIGHT
    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) return Direction.UP
    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) return Direction.DOWN

    return Direction.NONE
  }
}
