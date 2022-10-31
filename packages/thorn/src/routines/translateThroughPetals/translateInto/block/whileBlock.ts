import { Block, Blocks, Target } from "petals-stem";

import { translateNodeListIntoBlock } from ".";
import { WhileNode } from "../../../../types/ast/nodes/while";
import { Context } from "../../context";
import { getBooleanReference } from "../../reference/boolean";

export default function (block: WhileNode, target: Target, thread: Block, context: Context): void {
  const transformedContent = translateNodeListIntoBlock(block.getBlock(), target, context);
  const transformedConditional = getBooleanReference(block.getCase(), target, thread, context);

  transformedConditional.performSideEffects(target, transformedContent.getTail(), context);
  transformedConditional.performSideEffects(target, thread, context);

  thread.getTail().append(target.getBlocks().createBlock(Blocks.Control.While, transformedConditional.getValue(target, thread, context), transformedContent));
}