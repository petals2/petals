import { ValueNode } from "../ast/node";
import { IdentifierNode } from "../ast/node/identifier";
import { LiteralNode } from "../ast/node/literal";
import { MathOperationNode } from "../ast/node/mathOperation";
import { Type } from "../ast/type";
import { BooleanType } from "../ast/type/boolean";
import { NumberType } from "../ast/type/number";
import { StringType } from "../ast/type/string";
import { VariableRedefinitionNode } from "../ast/node/variableRedefinition";
import { ThornVariableRefrence } from "../refrences/thorn/variable";
import { TranslationContext } from "../translate/context";
import { ArrayLiteralNode } from "../ast/node/arrayLiteral";
import { ArrayType } from "../ast/type/array";
import { FunctionCallNode } from "../ast/node/functionCall";
import { getFunctionReference } from "../refrences/petals/function/getFunctionReference";

export function getType(v: ValueNode, context: TranslationContext): Type {
  if (v instanceof IdentifierNode) {
    return context.resolveIdentifier(v).getType(context);
  }

  if (v instanceof VariableRedefinitionNode) {
    return getType(v.getBase(), context);
  }

  if (v instanceof LiteralNode) {
    const literalValue = v.getValue();

    if (typeof literalValue === "string") {
      return new StringType(v.getTokenRange());
    }

    if (typeof literalValue === "number") {
      return new NumberType(v.getTokenRange());
    }

    if (typeof literalValue === "boolean") {
      return new BooleanType(v.getTokenRange());
    }
  }

  if (v instanceof MathOperationNode) {
    const leftHand = getType(v.getLeftHand(), context);
    const rightHand = getType(v.getRightHand(), context);

    if (leftHand.isNumberType() && rightHand.isNumberType()) {
      return new NumberType(v.getTokenRange());
    }

    if (leftHand.isStringType() || rightHand.isStringType()) {
      return new StringType(v.getTokenRange());
    }

    throw new Error("Failed to compute math operation type");
  }

  if (v instanceof ArrayLiteralNode) {
    const arrayContentType = v.getContents().map(node => getType(node, context));

    // TODO: actually check that all arrayContentTypes are the same.

    return new ArrayType(v.getTokenRange(), arrayContentType[0], v.getContents().length);
  }

  if (v instanceof FunctionCallNode) {
    const ref = getFunctionReference(v, context);

    return ref.getReturnType();
  }

  throw new Error("Failed to getType for: " + v.constructor.name);
}
