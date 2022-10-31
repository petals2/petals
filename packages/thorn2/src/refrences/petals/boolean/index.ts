import { Block } from "petals-stem";
import { ValueNode } from "../../../ast/node";
import { ComparisonNode } from "../../../ast/node/comparison";
import { LiteralNode } from "../../../ast/node/literal";
import { TranslationContext } from "../../../translate/context";
import { getReporterReference } from "../reporter";
import type { BooleanReference, ConstBooleanReference } from "./booleanReference";
import { ComparisonReference } from "./comparison";
import { LiteralReference } from "./literal";
import { ReporterReference } from "./reporter";

export function getBooleanReference(node: ValueNode, tail: Block, context: TranslationContext): ConstBooleanReference | BooleanReference {
  if (node instanceof LiteralNode) {
    return new LiteralReference(node);
  }

  if (node instanceof ComparisonNode) {
    return new ComparisonReference(node);
  }

  return new ReporterReference(getReporterReference(node, tail, context));
}
