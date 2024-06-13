import { Rect2D } from "./Rect2D";
import { Vect2D } from "./Vect2D";
enum SpriteType {
  single = 0,
  sheet = 1,
}
export class SpriteRenderer {
  rect: Rect2D;
  // imageSrc: string;
  sourceImgElement: HTMLImageElement;
  sprteType: SpriteType = SpriteType.single;
  animated: boolean = false;
  sourceFrameWidth: number = 0;
  sourceFrameHeight: number = 0;
  animationProgress: number = 0;
  animationLength: number = 1;
  posArray: Vect2D[] = [new Vect2D(0, 0)];
  staticOffset: Vect2D = new Vect2D(0, 0);
  constructor(
    rect: Rect2D,
    sourceImgElement: HTMLImageElement,
    animated: boolean = false,
    animationLength: number = 1,
    posArray: Vect2D[] = [new Vect2D(0, 0)]
  ) {
    this.rect = rect;
    // this.imageSrc = imageSrc;
    // this.sourceImgElement = new Image();
    this.sourceImgElement = sourceImgElement;
    this.sourceFrameHeight = rect.height;
    this.sourceFrameWidth = rect.height;
    this.animated = animated;
    this.animationLength = animationLength;
    this.posArray = posArray;
  }

  setSourceFrameSize(size: Vect2D) {
    this.sourceFrameWidth = size.x;
    this.sourceFrameHeight = size.y;
  }
  setTargetSize(size: Vect2D) {
    this.rect.width = size.x;
    this.rect.height = size.y;
  }
  setStaticSourceOffset(offset: Vect2D) {
    this.staticOffset.x = offset.x;
    this.staticOffset.y = offset.y;
  }
  drawFrame(
    ctx: CanvasRenderingContext2D,
    sourceXpos: number,
    sourceYpos: number,
    targetXpos: number,
    targetYpos: number
  ) {
    ctx.drawImage(
      this.sourceImgElement,
      sourceXpos,
      sourceYpos,
      this.sourceFrameWidth,
      this.sourceFrameHeight,
      targetXpos,
      targetYpos,
      this.rect.width,
      this.rect.height
    );
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.animated)
      this.drawFrame(
        ctx,
        this.staticOffset.x,
        this.staticOffset.y,
        this.rect.x,
        this.rect.y
      );
    else {
      this.drawFrame(
        ctx,
        this.posArray[this.animationProgress * this.posArray.length].x,
        this.posArray[this.animationProgress * this.posArray.length].y,
        this.rect.x,
        this.rect.y
      );
    }
  }
  update(delta: number) {
    if (this.animated) {
      this.animationProgress += delta / this.animationLength;
      this.animationProgress = this.animationProgress % 1;
    }
  }
}
