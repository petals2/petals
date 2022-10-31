import { Block, Blocks, Input, Target } from "petals-stem";

import { Context } from "../../context";
import { VariableReference } from "./abstract";

export class FunctionArgumentReference extends VariableReference {
  constructor(public readonly name: string) {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {}

  changeValue(value: Input, target: Target, thread: Block, context: Context): never {
    throw new Error("Cannot modify function arguments");
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): never {
    throw new Error("Cannot modify function arguments");
  }

  getValue(target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Argument.ReporterStringNumber> {
    return target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, this.name);
  }
}