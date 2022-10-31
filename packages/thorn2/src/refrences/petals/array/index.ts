import { Block } from "petals-stem";
import { ValueNode } from "../../../ast/node";
import { ArrayLiteralNode } from "../../../ast/node/arrayLiteral";
import { ComparisonNode } from "../../../ast/node/comparison";
import { IdentifierNode } from "../../../ast/node/identifier";
import { LiteralNode } from "../../../ast/node/literal";
import { TranslationContext } from "../../../translate/context";
import { ConstIdentifierReference, IdentifierReference } from "./identifier";
import { ArrayReference, ConstArrayReference } from "./arrayReference";
import { LiteralReference } from "./literal";
import { ThornFunctionRefrence } from "../../thorn/function";

export function getArrayReference(node: ValueNode, tail: Block, context: TranslationContext): ConstArrayReference | ArrayReference {
  if (node instanceof ArrayLiteralNode) {
    return new LiteralReference(node);
  }

  if (node instanceof IdentifierNode) {
    const resolved = context.resolveIdentifier(node);

    if (resolved instanceof ThornFunctionRefrence) throw new Error("Cannot get an ArrayReference of a ThornFunctionReference");

    return resolved.isConstant() ? new ConstIdentifierReference(node) : new IdentifierReference(node);
  }

  throw new Error("Failed to get array reference for " + node.constructor.name);
}
