import { VariableReference } from "./variable/abstract";
import { ValueTreeNode } from "../../../types/ast/node";
import { ListReference } from "./list/abstract";
import { Context } from "../context";
import { getListReference } from "./list";
import { getVariableReference } from "./variable";
import { getType } from "../getType";
import { getBooleanReference } from "./boolean";
import { BooleanReference } from "./boolean/abstract";
import { Target, Block } from "petals-stem";

export function getUnknownReference(value: ValueTreeNode, target: Target, thread: Block, context: Context): VariableReference | ListReference | BooleanReference {
  if (value.type === "parenthesisedExpressionNode") return getUnknownReference(value.getContents(), target, thread, context);

  if (value.type === "variableReference") {
    if (context.hasList(value.getName())) {
      return getListReference(value, target, thread, context);
    }

    return getVariableReference(value, target, thread, context);
  }

  if (value.type === "arrayLiteral" || value.type === "structLiteral")
    return getListReference(value, target, thread, context);

  if (value.type === "numberLiteral" || value.type === "stringLiteral" || value.type === "mathOperation" || value.type === "methodCall" || value.type === "heapCopy" || value.type === "new")
    return getVariableReference(value, target, thread, context);

  if (value.type === "booleanLiteral" || value.type === "comparisonOperation")
    return getBooleanReference(value, target, thread, context);

  if (value.type === "propertyReference") {
    // find the result type of the propertyReference

    let resultantType = getType(value, context);

    while (resultantType.isReferenceType()) resultantType = resultantType.dereference()

    if (resultantType.isStructureType() || resultantType.isListType()) {
      return getListReference(value, target, thread, context);
    }

    return getVariableReference(value, target, thread, context);
  }

  if (value.type === "indexReference") {
    let type = getType(value, context);

    while (type.isReferenceType()) type = type.dereference();

    if (type.isStructureType() || type.isListType()) {
      return getListReference(value, target, thread, context);
    }

    return getVariableReference(value, target, thread, context);
  }

  throw new Error("Cannot get reference for " + value.type);
}
