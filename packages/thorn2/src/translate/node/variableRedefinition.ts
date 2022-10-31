import { Block } from "petals-stem";
import { VariableDefinitionNode } from "../../ast/node/variableDefinition";
import { getUnknownReference } from "../../refrences/petals/unknown";
import { TranslationContext } from "../context";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { BooleanReference } from "../../refrences/petals/boolean/booleanReference";
import { ReporterReference } from "../../refrences/petals/reporter/reporterReference";
import { VariableRedefinitionNode } from "../../ast/node/variableRedefinition";
import { VariableRedefinitionReference } from "../../refrences/petals/reporter/variableRedefinition";

export function translateVariableRedefinitionIntoBlock(node: VariableRedefinitionNode, context: TranslationContext): Block {
  const tail = context.getTarget().getBlocks().createBlock(Phantom)

  new VariableRedefinitionReference(node).performSideEffects(tail, context);

  return tail.getHead();
}
