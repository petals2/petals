import { AnyInput, Block, Blocks, Input, Target } from "petals-stem";

import { getVariableReference } from ".";
import { IndexReferenceNode } from "../../../../types/ast/nodes/indexReference";
import { Context } from "../../context";
import { getListReference } from "../list";
import { ListReference } from "../list/abstract";
import { VariableReference } from "./abstract";

export class VariableIndexReference extends VariableReference {
  protected value: VariableReference | undefined;
  protected base: ListReference | undefined;

  constructor(protected readonly variable: IndexReferenceNode) {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {
    this.base = getListReference(this.variable.getBase(), target, thread, context);
    this.value = getVariableReference(this.variable.getReference(), target, thread, context);

    this.value.performSideEffects(target, thread, context);
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    if (!this.base || !this.value) this.performSideEffects(target, thread, context);

    return this.base!.overwriteAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, 1, Input.shadowed(this.value!.getValue(target, thread, context)))), value, target, thread, context)
  }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    if (!this.base || !this.value) this.performSideEffects(target, thread, context);

    return this.setValue(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, Input.shadowed(this.getValue(target, thread, context)), value)), target, thread, context)
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    if (!this.base || !this.value) this.performSideEffects(target, thread, context);

    return this.base!.getItemAtIndex(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add, 1, Input.shadowed(this.value!.getValue(target, thread, context)))), target, thread, context) as AnyInput;
  }
}