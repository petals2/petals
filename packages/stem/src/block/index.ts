import { Input, SerializedInput } from "./input";
import { ID } from "../id";
import { Field, SerializedField } from "./field";

export type SerializedBlock = {
  opcode: string,
  next: string | null,
  parent: string | null,
  inputs: Record<string, SerializedInput>,
  fields: Record<string, SerializedField>,
  shadow: boolean,
  topLevel: boolean,
}

export abstract class Block {
  private id: string = ID.generate();
  private _next: Block | undefined;
  private parent: Block | undefined;
  private inputs: Map<string, Input> = new Map();
  private fields: Map<string, Field> = new Map();
  private shadow: boolean = false;

  constructor(
    protected readonly opcode: string,
  ) {}

  next(): Block { 
    if (this._next === undefined)
      throw new Error("No next block");

    return this._next;
  }

  append<T extends Block>(block: T): T {
    this._next = block;
    block.setParent(this);
    return block;
  }

  hasNext(): boolean { return this._next !== undefined }
  getNext(): Block | undefined { return this._next }
  setNext(block: Block | undefined): this { this._next = block; block?.setParent(this); return this }

  hasParent(): boolean { return this.parent !== undefined }
  getParent(): Block | undefined { return this.parent }
  setParent(block: Block): this { this.parent = block; return this }

  getChildren(): Block[] {
    let children: Block[] = [];

    for (let input of this.inputs.values()) {
      const topLayer = input.getTopLayer();

      if (topLayer instanceof Block) children.push(topLayer);

      const bottomLayer = input.getBottomLayer();

      if (bottomLayer instanceof Block) children.push(bottomLayer);
    }

    return children;
  }

  getHead(): Block {
    let top: Block = this;

    while(top.hasParent()) top = top.getParent()!;

    return top;
  }

  isHead() {
    return !this.hasParent();
  }

  getTail(): Block {
    let top: Block = this;

    while (top.hasNext()) top = top.next();

    return top;
  }

  protected getInput(name: string): Input | undefined { return this.inputs.get(name) }
  protected setInput(name: string, input: Input): this { this.inputs.set(name, input); return this }
  protected clearInputs(): this { this.inputs.clear(); return this }

  protected getField(name: string): Field | undefined { return this.fields.get(name) }
  protected setField(name: string, field: Field): this { this.fields.set(name, field); return this }

  protected getShadow(): boolean { return this.shadow }
  protected setShadow(shadow: boolean): this { this.shadow = shadow; return this }

  getOpcode(): string { return this.opcode }

  getId(): string { return this.id }

  serialize(): SerializedBlock {
    let inputs: Record<string, SerializedInput> = {};

    for (let [name, input] of this.inputs.entries()) {
      inputs[name] = input.serialize();
    }

    let fields: Record<string, SerializedField> = {};

    for (let [name, field] of this.fields.entries()) {
      fields[name] = field.serialize();
    }

    return {
      opcode: this.opcode,
      next: this._next ? this._next.getId() : null,
      parent: this.parent ? this.parent.getId() : null,
      inputs,
      fields,
      shadow: this.shadow,
      topLevel: this.parent === undefined,
    }
  }

  isYieldPoint() {
    return false;
  }
}
