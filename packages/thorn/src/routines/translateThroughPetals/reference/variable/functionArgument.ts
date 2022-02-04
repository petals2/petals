import { Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { VariableReference } from "./abstract";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { Argument } from "petals-stem/dist/src/block/category/argument";

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

  getValue(target: Target, thread: Block, context: Context): InstanceType<typeof Argument.ReporterStringNumber> {
    return target.getBlocks().createBlock(Argument.ReporterStringNumber, this.name);
  }
}
