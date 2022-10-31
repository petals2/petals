import { FunctionCallNode } from "../../../ast/node/functionCall";
import { IdentifierNode } from "../../../ast/node/identifier";
import { PropertyReferenceNode } from "../../../ast/node/propertyReference";
import { TranslationContext } from "../../../translate/context";
import { getType } from "../../../type";
import { ThornVariableRefrence } from "../../thorn/variable";
import { AbstractFunctionTranslator } from "./abstractFunctionTranslator";
import { getArrayPropertyReferenceFunctionReference } from "./array/getArrayPropertyReferenceFunctionReference";

export function getFunctionReference(node: FunctionCallNode, context: TranslationContext): AbstractFunctionTranslator {
  const base = node.getBase();

  console.log(base);

  if (base instanceof PropertyReferenceNode) {
    const basebase = base.getBase();
    const bbtype = getType(basebase, context);

    console.log(basebase, bbtype);

    if (bbtype.isArrayType()) {
      return getArrayPropertyReferenceFunctionReference(node, context);
    }
  }

  if (base instanceof IdentifierNode) {
    const ident = context.resolveIdentifier(base);

    if (ident instanceof ThornVariableRefrence) {
      throw new Error("TODO: call variable references");
    }

    ident.getProcCodeId()
  }

  throw new Error("Failed to translate node");
}
