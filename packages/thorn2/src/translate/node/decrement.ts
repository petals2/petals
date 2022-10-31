import { Block } from "petals-stem";
import { VariableDefinitionNode } from "../../ast/node/variableDefinition";
import { getUnknownReference } from "../../refrences/petals/unknown";
import { TranslationContext } from "../context";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { BooleanReference } from "../../refrences/petals/boolean/booleanReference";
import { ReporterReference } from "../../refrences/petals/reporter/reporterReference";
import { VariableRedefinitionNode } from "../../ast/node/variableRedefinition";
import { VariableRedefinitionReference } from "../../refrences/petals/reporter/variableRedefinition";
import { DecrementReference } from "../../refrences/petals/reporter/decrement";
import { DecrementNode } from "../../ast/node/decrement";

export function translateDecrementBlock(node: DecrementNode, context: TranslationContext): Block {
  const tail = context.getTarget().getBlocks().createBlock(Phantom)

  new DecrementReference(node).performSideEffects(tail, context);

  return tail.getHead();
}
