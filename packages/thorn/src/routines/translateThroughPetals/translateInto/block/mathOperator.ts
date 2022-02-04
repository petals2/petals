import { Block } from "petals-stem/dist/src/block";
import { Target } from "petals-stem/dist/src/target";
import { translateNodeIntoBlock } from ".";
import { MathOperationNode } from "../../../../types/ast/nodes/mathOperation";
import { Context } from "../../context";

export default function (node: MathOperationNode, target: Target, thread: Block, context: Context): void {
  const left = translateNodeIntoBlock(node, target, context);
  const right = translateNodeIntoBlock(node, target, context);

  thread.getTail().append(left).getTail().append(right);
}
