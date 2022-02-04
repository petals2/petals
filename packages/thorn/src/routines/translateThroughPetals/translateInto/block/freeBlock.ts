import { FreeNode } from "../../../../types/ast/nodes/freeNode";
import { Target } from "petals-stem/dist/src/target";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { getVariableReference } from "../../reference/variable";
import { getType } from "../../getType";
import { Procedures } from "petals-stem/dist/src/block/category/procedures";
import { Input } from "petals-stem/dist/src/block/input";

export default function (node: FreeNode, target: Target, thread: Block, context: Context): void {
  const varToFree = getVariableReference(node.getValue(), context);
  const type = getType(node.getValue(), context);

  if (!type.isHeapReferenceType())
    throw new Error("Failed to free non-heap reference");

  const heap = context.getHeap(type.getHeapName());

  thread.getTail().append(target.getBlocks().createBlock(Procedures.Call, heap.free.getPrototype(), Input.shadowed(varToFree.getValue(target, thread, context))));
}
