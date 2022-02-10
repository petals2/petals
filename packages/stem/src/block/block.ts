import { Input, SerializedInput } from "./input";
import { Field, SerializedField } from "./field";
import type { Reporter } from "./kinds/reporter";
import type { Boolean } from "./kinds/boolean";
import type { Operators, Argument, Control, Events, Looks, Motion, Procedures, Sensing, Sound, Variables } from "./category";
import type { Stack } from "./kinds/stack";
import type { Cap } from "./kinds/cap";
import type { Hat } from "./kinds/hat";
import type { C } from "./kinds/c";
import type { E } from "./kinds/e";
import { ID } from "../id";

export type ArgumentOpcodes = ReturnType<InstanceType<(typeof Argument)[keyof typeof Argument]>["getOpcode"]>
export type ControlOpcodes = ReturnType<InstanceType<(typeof Control)[keyof typeof Control]>["getOpcode"]>
export type EventsOpcodes = ReturnType<InstanceType<(typeof Events)[keyof typeof Events]>["getOpcode"]>
export type LooksOpcodes = ReturnType<InstanceType<(typeof Looks)[keyof typeof Looks]>["getOpcode"]>
export type MotionOpcodes = ReturnType<InstanceType<(typeof Motion)[keyof typeof Motion]>["getOpcode"]>
export type OperatorsOpcodes = ReturnType<InstanceType<(typeof Operators)[keyof typeof Operators]>["getOpcode"]>
export type ProceduresOpcodes = ReturnType<InstanceType<(typeof Procedures)[keyof typeof Procedures]>["getOpcode"]>
export type SensingOpcodes = ReturnType<InstanceType<(typeof Sensing)[keyof typeof Sensing]>["getOpcode"]>
export type SoundOpcodes = ReturnType<InstanceType<(typeof Sound)[keyof typeof Sound]>["getOpcode"]>
export type VariablesOpcodes = ReturnType<InstanceType<(typeof Variables)[keyof typeof Variables]>["getOpcode"]>

export type Opcodes = ArgumentOpcodes | ControlOpcodes | EventsOpcodes | LooksOpcodes | MotionOpcodes | OperatorsOpcodes | ProceduresOpcodes | SensingOpcodes | SoundOpcodes | VariablesOpcodes;

export type SerializedBlock = {
  opcode: string,
  next: string | null,
  parent: string | null,
  inputs: Record<string, SerializedInput>,
  fields: Record<string, SerializedField>,
  shadow: boolean,
  topLevel: boolean,
}

export abstract class Block<Opcode extends string = string> {
  private id: string = ID.generate();
  private _next: Block | undefined;
  private parent: Block | undefined;
  private inputs: Map<string, Input> = new Map();
  private fields: Map<string, Field> = new Map();
  private shadow: boolean = false;

  constructor(
    protected readonly opcode: Opcode,
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

  getOpcode(): Opcode { return this.opcode }

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

  isReporter(): this is Reporter { return false }
  isBoolean(): this is Boolean { return false }
  isStack(): this is Stack { return false }
  isCap(): this is Cap { return false }
  isHat(): this is Hat { return false }
  isC(): this is C { return false }
  isE(): this is E { return false }
}
