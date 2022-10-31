import { Block } from "petals-stem";
import { VariableDefinitionNode } from "../../ast/node/variableDefinition";
import { getUnknownReference } from "../../refrences/petals/unknown";
import { TranslationContext } from "../context";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { BooleanReference } from "../../refrences/petals/boolean/booleanReference";
import { ReporterReference } from "../../refrences/petals/reporter/reporterReference";
import { WhileNode } from "../../ast/node/while";
import { Control } from "petals-stem/dist/src/block";
import { getBooleanReference } from "../../refrences/petals/boolean";
import { translateStack } from "..";
import { IfNode } from "../../ast/node/if";

export function translateIfIntoBlock(node: IfNode, context: TranslationContext): Block {
  const head = context.getTarget().getBlocks().createBlock(Phantom);
  const condition = getBooleanReference(node.getCondition(), head.getTail(), context);

  condition.performSideEffects(head.getTail(), context);

  head.getTail().append(context.getTarget().getBlocks().createBlock(Control.If, condition.getValue(head.getTail(), context), translateStack(node.getBody(), context)))

  return head.getHead();
}
