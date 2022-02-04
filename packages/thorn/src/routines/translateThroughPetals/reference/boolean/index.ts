import { ValueTreeNode } from "../../../../types/ast/node";
import { Context } from "../../context";
import { getVariableReference } from "../variable";
import { BooleanReference } from "./abstract";
import { BooleanLiteralReference } from "./booleanLiteralReference";
import { BooleanComparisonOperationReference } from "./comparisonOperation";
import { BooleanValueReference } from "./valueReference";

export function getBooleanReference(value: ValueTreeNode, context: Context): BooleanReference {
  if (value.type === "parenthesisedExpressionNode") return getBooleanReference(value.getContents(), context);

  if (value.type === "booleanLiteral") return new BooleanLiteralReference(value.getValue());
  if (value.type === "comparisonOperation") return new BooleanComparisonOperationReference(value.getLeftHand(), value.getRightHand(), value.getComparison(), context);

  return new BooleanValueReference(getVariableReference(value, context));
}
