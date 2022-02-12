import { Block, Blocks, Input, StringInput, Target } from "petals-stem";

import { Context } from "../../context";
import { VariableReference } from "../variable/abstract";
import { BooleanReference } from "./abstract";

export class BooleanValueReference extends BooleanReference {
  constructor(protected readonly valueReference: VariableReference) { super() }

  getValue(target: Target, thread: Block, context: Context): Block {
    return target.getBlocks().createBlock(Blocks.Operators.Equals, Input.shadowed(this.valueReference.getValue(target, thread, context)), Input.shadowed(new StringInput("true")));
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {
    this.valueReference.performSideEffects(target, thread, context);
  }
}