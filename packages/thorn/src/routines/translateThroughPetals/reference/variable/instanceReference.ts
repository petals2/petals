import { Variables } from "petals-stem/dist/src/block/category/variables";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { Variable } from "petals-stem/dist/src/variable";
import { Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { VariableReference } from "./abstract";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";

export class VariableInstanceReference extends VariableReference {
  constructor(public readonly variable: Variable) {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: number | Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ChangeVariableBy> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Variables.ChangeVariableBy,
      this.variable,
      value,
    ));
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.SetVariableTo> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Variables.SetVariableTo,
      this.variable,
      value,
    ));
  }

  getValue(target: Target, thread: Block, context: Context): VariableInput {
    return new VariableInput(this.variable);
  }
}
