import { Block, Blocks, Target } from "petals-stem";

import { translateNodeListIntoBlock } from ".";
import { ifBlockNode } from "../../../../types/ast/nodes/ifBlock";
import { Context } from "../../context";
import { getBooleanReference } from "../../reference/boolean";

export default function (node: ifBlockNode, target: Target, thread: Block, context: Context): void {
  const comparison = getBooleanReference(node.getComparison(), target, thread, context);
  const contents = translateNodeListIntoBlock(node.getContents(), target, context);

  if (node.getElseContents()) {
    const elseContents = translateNodeListIntoBlock(node.getElseContents()!, target, context);

    thread.getTail().append(target.getBlocks().createBlock(Blocks.Control.IfElse, comparison.getValue(target, thread, context), contents, elseContents));
    return;
  }

  thread.getTail().append(target.getBlocks().createBlock(Blocks.Control.If, comparison.getValue(target, thread, context), contents));
}