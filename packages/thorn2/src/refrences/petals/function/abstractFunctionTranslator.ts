import { Block, Input } from "petals-stem";
import { FunctionCallNode } from "../../../ast/node/functionCall";
import { Type } from "../../../ast/type";
import { TranslationContext } from "../../../translate/context";

export interface AbstractFunctionTranslator {
  getReturnType(): Type;
  translateFunctionCallNode(node: FunctionCallNode, stack: Block, context: TranslationContext): Input;
}
