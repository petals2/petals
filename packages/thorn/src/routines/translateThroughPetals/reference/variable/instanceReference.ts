import { Block, Blocks, Input, Target, Variable, VariableInput } from "petals-stem";

import { Context } from "../../context";
import { VariableReference } from "./abstract";

export class VariableInstanceReference extends VariableReference {
  constructor(public readonly variable: Variable) {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: number | Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ChangeVariableBy> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Variables.ChangeVariableBy,
      this.variable,
      value,
    ));
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.SetVariableTo> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Variables.SetVariableTo,
      this.variable,
      value,
    ));
  }

  getValue(target: Target, thread: Block, context: Context): VariableInput {
    return new VariableInput(this.variable);
  }
}