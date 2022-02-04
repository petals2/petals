import { Block } from "petals-stem/dist/src/block";
import { Target } from "petals-stem/dist/src/target";
import { translateNodeIntoBlock } from ".";
import { ComparisonOperationNode } from "../../../../types/ast/nodes/comparisonOperation";
import { Context } from "../../context";

export default function (node: ComparisonOperationNode, target: Target, thread: Block, context: Context): void {
  const left = translateNodeIntoBlock(node, target, context);
  const right = translateNodeIntoBlock(node, target, context);

  thread.getTail().append(left).getTail().append(right);
}
