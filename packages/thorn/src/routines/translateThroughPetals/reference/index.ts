import { VariableReference } from "./variable/abstract";
import { ValueTreeNode } from "../../../types/ast/node";
import { ListReference } from "./list/abstract";
import { Context } from "../context";
import { getListReference } from "./list";
import { getVariableReference } from "./variable";
import { getType } from "../getType";
import { getBooleanReference } from "./boolean";
import { BooleanReference } from "./boolean/abstract";

export function getUnknownReference(value: ValueTreeNode, context: Context): VariableReference | ListReference | BooleanReference {
  if (value.type === "parenthesisedExpressionNode") return getUnknownReference(value.getContents(), context);

  if (value.type === "variableReference") {
    if (context.hasList(value.getName())) {
      return getListReference(value, context);
    }

    return getVariableReference(value, context);
  }

  if (value.type === "arrayLiteral" || value.type === "structLiteral")
    return getListReference(value, context);

  if (value.type === "numberLiteral" || value.type === "stringLiteral" || value.type === "mathOperation" || value.type === "methodCall" || value.type === "heapCopy")
    return getVariableReference(value, context);

  if (value.type === "booleanLiteral" || value.type === "comparisonOperation")
    return getBooleanReference(value, context);

  if (value.type === "propertyReference") {
    // find the result type of the propertyReference

    let resultantType = getType(value, context);

    while (resultantType.isReferenceType()) resultantType = resultantType.dereference()

    if (resultantType.isStructureType() || resultantType.isListType()) {
      return getListReference(value, context);
    }

    return getVariableReference(value, context);
  }

  if (value.type === "indexReference") {
    let type = getType(value, context);

    while (type.isReferenceType()) type = type.dereference();

    if (type.isStructureType() || type.isListType()) {
      return getListReference(value, context);
    }

    return getVariableReference(value, context);
  }

  throw new Error("Cannot get reference for " + value.type);
}
