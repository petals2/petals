import { Sprite, Stage } from "petals-stem";
import { Events, Input, StringInput } from "petals-stem/dist/src/block";
import { WhenBroadcastReceived } from "petals-stem/dist/src/block/category/events/whenBroadcastReceived";
import { Definition } from "petals-stem/dist/src/block/category/procedures/definition";
import { ArrowFunctionNode } from "../../ast/node/arrowFunction";
import { FunctionDefinitionNode } from "../../ast/node/functionDefinition";
import { Type } from "../../ast/type";
import { AnyType } from "../../ast/type/any";
import { BooleanType } from "../../ast/type/boolean";
import { FunctionType } from "../../ast/type/function";
import { functionProccodeIds, functionReferenceIds, ID } from "../../id";
import { translateStack } from "../../translate";
import { TranslationContext } from "../../translate/context";

export class ThornFunctionRefrence {
  protected customBlockDefiniton: Definition;
  protected procCodeId: string;

  constructor(
    protected readonly node: FunctionDefinitionNode | ArrowFunctionNode,
    protected readonly target: Sprite | Stage,
    context: TranslationContext,
  ) {
    this.customBlockDefiniton = target.getBlocks().createCustomBlockHat(
      this.procCodeId = functionProccodeIds.generate(),
      node.getArgs().map(arg => ({
        name: arg.name,
        type: arg.type instanceof BooleanType ? "boolean" : "string",
        defaultValue: arg.type instanceof BooleanType ? false : "",
      }) as any)
    );
  }

  getProcCodeId() {
    return this.procCodeId;
  }

  translateIntoScratch(context: TranslationContext) {
    const old = context.getTargetRaw();
  
    context.setTarget(this.target);
    this.customBlockDefiniton.append(translateStack(this.node.getBody(), context));
  
    if (old) {
      context.setTarget(old);
    } else {
      context.clearTarget();
    }
  }

  getType(context: TranslationContext): Type {
    return new FunctionType(
      this.node.getTokenRange(),
      this.node.getArgs().map(arg => arg.type ?? new AnyType(arg.name.getTokenRange())),
      this.node.getReturnType() ?? new AnyType(this.node.getTokenRange()),
    );
  }
}
