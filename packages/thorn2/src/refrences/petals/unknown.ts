import { Block } from "petals-stem";
import { ValueNode } from "../../ast/node";
import { IdentifierNode } from "../../ast/node/identifier";
import { TranslationContext } from "../../translate/context";
import { getType } from "../../type";
import { getArrayReference } from "./array";
import { ArrayReference, ConstArrayReference } from "./array/arrayReference";
import { getBooleanReference } from "./boolean";
import { BooleanReference, ConstBooleanReference } from "./boolean/booleanReference";
import { getReporterReference } from "./reporter";
import { ConstReporterReference, ReporterReference } from "./reporter/reporterReference";

export type UnknownReference = ConstBooleanReference | BooleanReference | ConstReporterReference | ReporterReference | ConstArrayReference | ArrayReference;

export function getUnknownReference(node: ValueNode, tail: Block, context: TranslationContext): UnknownReference {
  const type = getType(node, context);

  console.log(node, type);

  if (type.isBooleanType() as any) { return getBooleanReference(node, tail, context) }

  if (type.isArrayType() as any) { return getArrayReference(node, tail, context) }

  return getReporterReference(node, tail, context)
}
