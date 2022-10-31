import { Block, Blocks, Target } from "petals-stem";

import { Context } from "../../context";
import { BooleanReference } from "./abstract";

export class BooleanLiteralReference extends BooleanReference {
  constructor(protected readonly value: boolean) {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {}

  getValue(target: Target, thread: Block, context: Context): Block {
    return target.getBlocks().createBlock(this.value ? Blocks.Operators.Not : Blocks.Operators.And)
  }
}