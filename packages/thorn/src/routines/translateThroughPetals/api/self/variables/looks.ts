import { AnyInput, Block, Blocks, Input, Target } from "petals-stem";

import { Context } from "../../../context";
import { VariableReference } from "../../../reference/variable/abstract";

export class SizeReference extends VariableReference {
  constructor() {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: number | Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Looks.ChangeSizeBy> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Looks.ChangeSizeBy,
      value
    ));
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Looks.SetSizeTo> {
    return thread.getTail().append(target.getBlocks().createBlock(
      Blocks.Looks.SetSizeTo,
      value
    ));
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    return target.getBlocks().createBlock(Blocks.Looks.Size);
  }
}