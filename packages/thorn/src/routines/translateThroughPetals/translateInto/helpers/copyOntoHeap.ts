import { Block } from "petals-stem/dist/src/block";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { Input } from "petals-stem/dist/src/block/input";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { Target } from "petals-stem/dist/src/target";
import { ValueTreeNode } from "../../../../types/ast/node";
import { Context } from "../../context";
import { getUnknownReference } from "../../reference";
import { BooleanReference } from "../../reference/boolean/abstract";
import { ListReference } from "../../reference/list/abstract";
import { HeapReference } from "../../reference/list/heapReference";
import { VariableReference } from "../../reference/variable/abstract";
import { StructTool } from "../../structTool";

export function copyOntoHeap(value: ValueTreeNode, heapName: string, target: Target, thread: Block, context: Context) {
  const heap = context.getHeap(heapName);

  const ref = getUnknownReference(value, context);

  if (ref instanceof VariableReference || ref instanceof BooleanReference) {
    const val = ref.getValue(target, thread, context);
    const heapRef = HeapReference.allocate(heap, Input.shadowed(new NumberInput(1)), target, thread, context);

    heapRef.overwriteAtIndex(Input.shadowed(new NumberInput(1)), Input.shadowed(val), target, thread, context);

    return heapRef;
  }

  if (ref instanceof ListReference) {
    const heapRef = HeapReference.allocate(heap, Input.shadowed(target.getBlocks().createBlock(Operators.Multiply, Input.shadowed(ref.getLength(target, thread, context)), Input.shadowed(new NumberInput(StructTool.getSize(ref.getContentType(context)))))), target, thread, context);

    ref.copyInto(heapRef, target, thread, context, false);

    return heapRef;
  }
}
