import { Block } from "petals-stem/dist/src/block";
import { Target } from "petals-stem/dist/src/target";
import { HeapDefinitionNode } from "../../../../types/ast/nodes/heapDefinitionNode";
import { Context } from "../../context";

export default function (node: HeapDefinitionNode, target: Target, thread: Block, context: Context): void {
  context.createHeap(node.getName(), node.getOptions())
}
