import { AnyInput, Block, Input, Target, Variable } from "petals-stem";

import { HeapCopyOperation } from "../../../../types/ast/nodes/heapCopyOperation";
import { Context, HeapReferenceData } from "../../context";
import { copyOntoHeap } from "../../translateInto/helpers/copyOntoHeap";
import { HeapReference } from "../list/heapReference";
import { VariableReference } from "./abstract";

export class VariableHeapCopyReference extends VariableReference {
  protected capturedIndex: HeapReference | undefined;

  constructor(public readonly variable: HeapCopyOperation) {
    super();
  }

  getHeap(): HeapReferenceData | undefined {
    return this.capturedIndex?.getHeap();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {
    this.capturedIndex = copyOntoHeap(this.variable.getValue(), this.variable.getName(), target, thread, context)
  }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    if (!this.capturedIndex) this.performSideEffects(target, thread, context);

    return this.capturedIndex!.heapIndex.changeValue(value, target, thread, context);
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    if (!this.capturedIndex) this.performSideEffects(target, thread, context);

    return this.capturedIndex!.heapIndex.changeValue(value, target, thread, context);
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    if (!this.capturedIndex) this.performSideEffects(target, thread, context);

    return this.capturedIndex!.heapIndex.getValue(target, thread, context);
  }
}