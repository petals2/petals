import { Block } from "petals-stem/dist/src/block";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { Context } from "../../context";
import { VariableReference } from "../variable/abstract";
import { BooleanReference } from "./abstract";

export class BooleanLiteralReference extends BooleanReference {
  constructor(protected readonly value: boolean) {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {}

  getValue(target: Target, thread: Block, context: Context): Block {
    return target.getBlocks().createBlock(this.value ? Operators.Not : Operators.And)
  }
}
