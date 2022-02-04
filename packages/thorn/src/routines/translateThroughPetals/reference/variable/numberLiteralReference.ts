import { Block } from "petals-stem/dist/src/block";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { Target } from "petals-stem/dist/src/target";
import { Context } from "../../context";
import { VariableReference } from "./abstract";

export class NumberLiteralReference extends VariableReference {
  constructor(protected readonly value: number) {
    super();
    this.value = value;
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    return new NumberInput(this.value);
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot set the value of a number literal");
  }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot change the value of a number literal");
  }
}
