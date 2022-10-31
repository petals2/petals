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
import { ForNode } from "../../ast/node/for";
import { translateNode } from ".";
import { ThornVariableRefrence } from "../../refrences/thorn/variable";
import { getType } from "../../type";

export function translateForIntoBlock(node: ForNode, context: TranslationContext): Block {
  context.enterContext()

  const init = node.getInitialization();

  if (init instanceof VariableDefinitionNode) {
    context.setIdentifier(init.getVariableName().getIdentifier(), new ThornVariableRefrence(init, context.getTarget(), init.getType() ?? getType(init.getValue(), context)));
  }

  const head = context.getTarget().getBlocks().createBlock(Phantom);
  const condition = getBooleanReference(node.getCondition(), head.getTail(), context);

  condition.performSideEffects(head.getTail(), context);

  head.append(translateNode(node.getInitialization(), context));

  head.getTail().append(context.getTarget().getBlocks().createBlock(Control.While, condition.getValue(head.getTail(), context), translateStack(node.getBody(), context).getTail().append(translateNode(node.getFinalExpression(), context)).getHead()))

  context.exitContext();

  return head.getHead();
}
