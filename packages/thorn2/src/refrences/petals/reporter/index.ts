import { Block } from "petals-stem";
import { ValueNode } from "../../../ast/node";
import { IdentifierNode } from "../../../ast/node/identifier";
import { IndexReferenceNode } from "../../../ast/node/indexReference";
import { LiteralNode } from "../../../ast/node/literal";
import { MathOperationNode } from "../../../ast/node/mathOperation";
import { TranslationContext } from "../../../translate/context";
import { ThornFunctionRefrence } from "../../thorn/function";
import { getArrayReference } from "../array";
import { ConstIdentifierReference, IdentifierReference } from "./identifier";
import { ConstIndexReference } from "./indexReference";
import { LiteralReference } from "./literal";
import { MathOpReference } from "./mathop";
import type { ReporterReference, ConstReporterReference } from "./reporterReference";

export function getReporterReference(node: ValueNode, tail: Block, context: TranslationContext): ConstReporterReference | ReporterReference {
  if (node instanceof IdentifierNode) {
    const resolve = context.resolveIdentifier(node);

    if (resolve instanceof ThornFunctionRefrence) {
      throw new Error("TODO");
    }

    if (resolve.isConstant()) {
      return new ConstIdentifierReference(node);
    }

    return new IdentifierReference(node);
  }

  if (node instanceof LiteralNode) {
    return new LiteralReference(node);
  }

  if (node instanceof MathOperationNode) {
    return new MathOpReference(node);
  }

  if (node instanceof IndexReferenceNode) {
    const arr = getArrayReference(node.getBase(), tail, context);

    if (arr.isWritable()) {
      throw new Error("TODO");
    }

    return new ConstIndexReference(node);
  }

  throw new Error("Failed to get reporter reference for " + (node as any).constructor.name);
}
