import { Project, Sb3 } from "..";
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

  static fromSb3(project: Project, sb3: Sb3, json: SerializedComment) {
    const comment = new Comment(new Vector2(json.x, json.y), json.text);
    comment.deserialize(project, sb3, json);
    return comment;
  }

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

  getComment() { return this.comment }
  setComment(comment: string): this { this.comment = comment; return this }

  getAttachedBlock(): Block | undefined { return this.block }
  attach(block: Block): this { this.block = block; return this }
  detach(): this { this.block = undefined; return this }

  getId(): string { return this.id }

   protected deserialize(project: Project, sb3: Sb3, json: SerializedComment) {
    this.setHeight(json.height);
    this.setMinimized(json.minimized);
    this.setComment(json.text);
    this.setWidth(json.width);
  }

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
