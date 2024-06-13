import { PLAYER_MOVE_SPEED_X } from "../constants";

import { IKeymap } from "../utils";
import RigidBody from "./RigidBody";
import { Rect2D } from "./Rect2D";
import { SpriteRenderer } from "./SpriteRenderer";
import { Vect2D } from "./Vect2D";
class Player {
  keymap: IKeymap;
  rect: Rect2D;
  rigidBody: RigidBody;
  moveSpeed: number;
  spriteRenderer: SpriteRenderer;
  pseudoSpriteLeft: SpriteRenderer;
  pseudoSpriteRight: SpriteRenderer;
  inputReceived: boolean = false;
  keysPressed = new Set<string>();
  isGrounded = false;
  ctx: CanvasRenderingContext2D;
  constructor(
    keymap: IKeymap,
    x: number,
    y: number,
    width: number,
    height: number,
    sourceImgElement: HTMLImageElement,
    spritePosArray: Vect2D[],
    ctx: CanvasRenderingContext2D
  ) {
    this.rect = new Rect2D(x, y, width, height, "red", true);
    this.rigidBody = new RigidBody(this.rect);
    this.rigidBody.dragX = 0.1;
    this.rigidBody.gravity = 3000;
    this.spriteRenderer = new SpriteRenderer(
      this.rect,
      sourceImgElement,
      false,
      1,
      spritePosArray
    );
    this.pseudoSpriteLeft = new SpriteRenderer(
      new Rect2D(
        this.rect.x - ctx.canvas.width,
        this.rect.y,
        this.rect.width,
        this.rect.height
      ),
      sourceImgElement,
      false,
      1,
      spritePosArray
    );
    this.pseudoSpriteRight = new SpriteRenderer(
      new Rect2D(
        this.rect.x + ctx.canvas.width,
        this.rect.y,
        this.rect.width,
        this.rect.height
      ),
      sourceImgElement,
      false,
      1,
      spritePosArray
    );
    this.ctx = ctx;
    this.moveSpeed = PLAYER_MOVE_SPEED_X;
    this.keymap = keymap;
    this.setupControls();
  }

  setupControls() {
    window.addEventListener("keydown", (e) => {
      this.keysPressed.add(e.key);
    });

    window.addEventListener("keyup", (e) => {
      this.keysPressed.delete(e.key);
    });
  }

  handleInput() {
    this.inputReceived = false;

    if (
      this.keysPressed.has(this.keymap.left) ||
      this.keysPressed.has("ArrowLeft")
    ) {
      this.moveLeft();
      this.inputReceived = true;
    }

    if (
      this.keysPressed.has(this.keymap.right) ||
      this.keysPressed.has("ArrowRight")
    ) {
      this.moveRight();
      this.inputReceived = true;
    }

    if (this.keysPressed.has(this.keymap.fire)) {
      // this.jump();
      // this.inputReceived = true;
    }
  }

  moveLeft() {
    this.rigidBody.ax = -PLAYER_MOVE_SPEED_X * 3000;
  }
  moveRight() {
    this.rigidBody.ax = PLAYER_MOVE_SPEED_X * 3000;
  }
  jump() {
    this.rigidBody.vy = -1000;
  }
  updatePseudoSprites() {
    this.pseudoSpriteLeft.rect.x = this.rect.x - this.ctx.canvas.width;
    this.pseudoSpriteRight.rect.x = this.rect.x + this.ctx.canvas.width;
    this.pseudoSpriteLeft.rect.y = this.rect.y;
    this.pseudoSpriteRight.rect.y = this.rect.y;
  }
  update(delta: number) {
    // this.inputReceived = false;
    this.handleInput();
    if (!this.inputReceived) {
      this.rigidBody.ax = 0;
    }
    if (this.isGrounded) {
      this.jump();
    }
    this.rigidBody.update(delta);
    if (this.rigidBody.vx > 0) {
      this.spriteRenderer.setStaticSourceOffset(
        new Vect2D(this.spriteRenderer.sourceFrameWidth * 1, 0)
      );
      this.pseudoSpriteLeft.setStaticSourceOffset(
        new Vect2D(this.pseudoSpriteLeft.sourceFrameWidth * 1, 0)
      );
      this.pseudoSpriteRight.setStaticSourceOffset(
        new Vect2D(this.pseudoSpriteRight.sourceFrameWidth * 1, 0)
      );
    } else if (this.rigidBody.vx < 0) {
      this.spriteRenderer.setStaticSourceOffset(
        new Vect2D(this.spriteRenderer.sourceFrameWidth * 0, 0)
      );
      this.pseudoSpriteLeft.setStaticSourceOffset(
        new Vect2D(this.pseudoSpriteLeft.sourceFrameWidth * 0, 0)
      );
      this.pseudoSpriteRight.setStaticSourceOffset(
        new Vect2D(this.pseudoSpriteRight.sourceFrameWidth * 0, 0)
      );
    }
    if(this.rect.x<0)
      this.rect.x += this.ctx.canvas.width ;
    if(this.rect.x>this.ctx.canvas.width)
      this.rect.x -= this.ctx.canvas.width ;
    

  }
}

export default Player;
