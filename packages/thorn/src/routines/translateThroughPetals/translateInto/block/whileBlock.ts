import { WhileNode } from "../../../../types/ast/nodes/while";
import { Target } from "petals-stem/dist/src/target";
import { translateNodeListIntoBlock } from ".";
import { Block } from "petals-stem/dist/src/block";
import { Context } from "../../context";
import { getBooleanReference } from "../../reference/boolean";
import { Control } from "petals-stem/dist/src/block/category/control";

export default function (block: WhileNode, target: Target, thread: Block, context: Context): void {
  const transformedContent = translateNodeListIntoBlock(block.getBlock(), target, context);
  const transformedConditional = getBooleanReference(block.getCase(), target, thread, context);

  transformedConditional.performSideEffects(target, transformedContent.getTail(), context);
  transformedConditional.performSideEffects(target, thread, context);

  thread.getTail().append(target.getBlocks().createBlock(Control.While, transformedConditional.getValue(target, thread, context), transformedContent));
}
