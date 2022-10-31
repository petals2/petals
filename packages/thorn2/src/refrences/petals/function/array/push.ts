import { Block, Input, StringInput } from "petals-stem";
import { FunctionCallNode } from "../../../../ast/node/functionCall";
import { PropertyReferenceNode } from "../../../../ast/node/propertyReference";
import { Type } from "../../../../ast/type";
import { VoidType } from "../../../../ast/type/void";
import { TranslationContext } from "../../../../translate/context";
import { getArrayReference } from "../../array";
import { getReporterReference } from "../../reporter";
import { AbstractFunctionTranslator } from "../abstractFunctionTranslator";

export class ArrayPush implements AbstractFunctionTranslator {
  getReturnType(): Type { return new VoidType() }

  translateFunctionCallNode(node: FunctionCallNode, stack: Block<string>, context: TranslationContext): Input {
    const ref = getArrayReference((node.getBase() as PropertyReferenceNode).getBase(), stack, context);

    if (!ref.isWritable()) throw new Error("Cannot push to a read-only array");

    if (node.getArgs().length == 0) throw new Error("Array.push missing arg0");

    const rref = getReporterReference(node.getArgs()[0], stack.getTail(), context);
    const rrefv = rref.getValue(stack.getTail(), context);

    stack.getTail().append(ref.push(rrefv, context));

    return Input.shadowed(new StringInput(""));
  }
}
