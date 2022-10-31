import { FunctionCallNode } from "../../../../ast/node/functionCall";
import { PropertyReferenceNode } from "../../../../ast/node/propertyReference";
import { TranslationContext } from "../../../../translate/context";
import { getArrayReference } from "../../array";
import { AbstractFunctionTranslator } from "../abstractFunctionTranslator";
import { ArrayPush } from "./push";

export function getArrayPropertyReferenceFunctionReference(node: FunctionCallNode, context: TranslationContext): AbstractFunctionTranslator {
  const pref = node.getBase();

  if (!(pref instanceof PropertyReferenceNode)) throw new Error("Context error");

  const arrayLikeNode = node.getBase();

  switch (pref.getProperty()) {
    case "push":
      return new ArrayPush();
  }

  throw new Error("TODO");
}
