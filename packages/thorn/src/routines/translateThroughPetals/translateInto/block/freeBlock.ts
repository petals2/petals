import { Block, Blocks, Input, Target } from "petals-stem";

import { FreeNode } from "../../../../types/ast/nodes/freeNode";
import { Context } from "../../context";
import { getType } from "../../getType";
import { getVariableReference } from "../../reference/variable";

export default function (node: FreeNode, target: Target, thread: Block, context: Context): void {
  const varToFree = getVariableReference(node.getValue(), target, thread, context);
  const type = getType(node.getValue(), context);

  if (!type.isHeapReferenceType())
    throw new Error("Failed to free non-heap reference");

  const heap = context.getHeap(type.getHeapName());

  thread.getTail().append(target.getBlocks().createBlock(Blocks.Procedures.Call, heap.free.getPrototype(), Input.shadowed(varToFree.getValue(target, thread, context))));
}