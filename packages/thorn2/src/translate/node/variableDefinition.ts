import { Block } from "petals-stem";
import { VariableDefinitionNode } from "../../ast/node/variableDefinition";
import { getUnknownReference } from "../../refrences/petals/unknown";
import { TranslationContext } from "../context";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { BooleanReference } from "../../refrences/petals/boolean/booleanReference";
import { ReporterReference } from "../../refrences/petals/reporter/reporterReference";
import { ArrayReference, ConstArrayReference } from "../../refrences/petals/array/arrayReference";

export function translateVariableDefinitionIntoBlock(node: VariableDefinitionNode, context: TranslationContext): Block {
  const tail = context.getTarget().getBlocks().createBlock(Phantom)

  const assignedTo = getUnknownReference(node.getVariableName(), tail.getTail(), context);

  if (!assignedTo.isWritable()) {
    throw new Error("Cannot assign to a constant");
  }

  const assignValue = getUnknownReference(node.getValue(), tail.getTail(), context);

  if (assignedTo instanceof ArrayReference) {
    if (!(assignValue instanceof ConstArrayReference)) {
      throw new Error("Cannot assign non-arrays to arrays");
    }

    tail.append(assignValue.copyTo(assignedTo, context).getHead());

    return tail.getHead();
  }

  assignedTo.setValue(tail.getTail(), assignValue, context);

  return tail.getHead();
}
