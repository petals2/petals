import { AnyInput, Block, Input, Target } from "petals-stem";

import { Context } from "../../context";
import { ListReference } from "../../reference/list/abstract";
import { VariableReference } from "../../reference/variable/abstract";

export class ListLengthReference extends VariableReference {
  constructor(protected readonly list: ListReference) { super() }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot set value of a list length reference");
  }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot change value of a list length reference");
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    return this.list.getLength(target, thread, context);
  }
}