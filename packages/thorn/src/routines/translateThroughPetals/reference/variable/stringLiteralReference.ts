import { Block } from "petals-stem/dist/src/block";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { StringInput } from "petals-stem/dist/src/block/input/string";
import { Target } from "petals-stem/dist/src/target";
import { Context } from "../../context";
import { VariableReference } from "./abstract";

export class StringLiteralReference extends VariableReference {
  constructor(protected readonly value: string) {
    super();
    this.value = value;
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    return new StringInput(this.value);
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot set the value of a string literal");
  }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot change the value of a string literal");
  }
}
