import { Block } from "../block/block";
import { ID } from "../id";
import { Vector2 } from "../types/vector2";

export type SerializedComment = {
  blockId: string | null;
  height: number;
  minimized: boolean;
  text: string;
  width: number;
  x: number;
  y: number;
}

export class Comment {
  protected id: string = ID.generate();
  protected width: number = 200;
  protected height: number = 200;
  protected block: Block | undefined;
  protected minimized: boolean = false;

  constructor(
    protected position: Vector2,
    protected comment: string
  ) {}

  getMinimized(): boolean { return this.minimized }
  setMinimized(minimized: boolean): this { this.minimized = minimized; return this }

  getWidth(): number { return this.width }
  setWidth(width: number): this { this.width = width; return this }

  getHeight(): number { return this.height }
  setHeight(height: number): this { this.height = height; return this }

  getAttachedBlock(): Block | undefined { return this.block }
  attach(block: Block): this { this.block = block; return this }
  detach(): this { this.block = undefined; return this }

  getId(): string { return this.id }

  serialize(): SerializedComment {
    return {
      blockId: this.block ? this.block.getId() : null,
      height: this.height,
      minimized: this.minimized,
      text: this.comment,
      width: this.width,
      x: this.position.getX(),
      y: this.position.getY(),
    };
  }
}
