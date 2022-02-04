import { Block } from "petals-stem/dist/src/block";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { Input } from "petals-stem/dist/src/block/input";
import { StringInput } from "petals-stem/dist/src/block/input/string";
import { Target } from "petals-stem/dist/src/target";
import { Context } from "../../context";
import { VariableReference } from "../variable/abstract";
import { BooleanReference } from "./abstract";

export class BooleanValueReference extends BooleanReference {
  constructor(protected readonly valueReference: VariableReference) { super() }

  getValue(target: Target, thread: Block, context: Context): Block {
    return target.getBlocks().createBlock(Operators.Equals, Input.shadowed(this.valueReference.getValue(target, thread, context)), Input.shadowed(new StringInput("true")));
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {
    this.valueReference.performSideEffects(target, thread, context);
  }
}
