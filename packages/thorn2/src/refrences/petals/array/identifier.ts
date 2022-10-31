import { Block, Input, Variable } from "petals-stem";
import { Variables } from "petals-stem/dist/src/block";
import { IdentifierNode } from "../../../ast/node/identifier";
import { LiteralNode } from "../../../ast/node/literal";
import { MathOperationNode } from "../../../ast/node/mathOperation";
import { TokenRange } from "../../../lexer/token";
import { TranslationContext } from "../../../translate/context";
import { ThornFunctionRefrence } from "../../thorn/function";
import { ArrayReference, ConstArrayReference } from "../array/arrayReference";
import { ConstBooleanReference } from "../boolean/booleanReference";
import { UnknownReference } from "../unknown";

export class ConstIdentifierReference extends ConstArrayReference {
  constructor(protected readonly identifier: IdentifierNode) { super() }

  getUnderlyingVariable(context: TranslationContext) {
    const res = context.resolveIdentifier(this.identifier);

    if (res instanceof ThornFunctionRefrence) {
      throw new Error("Figure out");
    }

    const resv = res.getScratchValue();

    if (resv instanceof Variable) {
      throw new Error("Cannot use a variable as a list");
    }

    return resv;
  }

  contains(sideEffectTail: Block<string>, item: Input, context: TranslationContext): Input {
    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ListContainsItem, this.getUnderlyingVariable(context), item));
  }

  findValueIndex(sideEffectTail: Block<string>, index: Input, context: TranslationContext): Input {
    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ItemNumOfList, this.getUnderlyingVariable(context), index));
  }

  getValue(sideEffectTail: Block<string>, index: Input, context: TranslationContext): Input {
    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ItemOfList, this.getUnderlyingVariable(context), index));
  }

  length(sideEffectTail: Block<string>, context: TranslationContext): Input {
    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.LengthOfList, this.getUnderlyingVariable(context)));
  }

  performSideEffects(tail: Block, context: TranslationContext): void {}
}

export class IdentifierReference extends ArrayReference {
  constructor(protected readonly identifier: IdentifierNode) { super() }

  getUnderlyingVariable(context: TranslationContext) {
    const res = context.resolveIdentifier(this.identifier);

    if (res instanceof ThornFunctionRefrence) {
      throw new Error("Figure out");
    }

    const resv = res.getScratchValue();

    if (resv instanceof Variable) {
      throw new Error("Cannot use a variable as a list");
    }

    return resv;
  }

  contains(sideEffectTail: Block<string>, item: Input, context: TranslationContext): Input {
    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ListContainsItem, this.getUnderlyingVariable(context), item));
  }

  findValueIndex(sideEffectTail: Block<string>, index: Input, context: TranslationContext): Input {
    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ItemNumOfList, this.getUnderlyingVariable(context), index));
  }

  getValue(sideEffectTail: Block<string>, index: Input, context: TranslationContext): Input {
    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ItemOfList, this.getUnderlyingVariable(context), index));
  }

  length(sideEffectTail: Block<string>, context: TranslationContext): Input {
    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.LengthOfList, this.getUnderlyingVariable(context)));
  }

  clear(context: TranslationContext): Block<string> {
    return context.getTarget().getBlocks().createBlock(Variables.DeleteAllOfList, this.getUnderlyingVariable(context));
  }

  delete(index: Input, context: TranslationContext): Block<string> {
    return context.getTarget().getBlocks().createBlock(Variables.DeleteOfList, this.getUnderlyingVariable(context), index);
  }

  insert(item: Input, index: Input, context: TranslationContext): Block<string> {
    return context.getTarget().getBlocks().createBlock(Variables.InsertAtList, this.getUnderlyingVariable(context), index, item);
  }

  push(index: Input, context: TranslationContext): Block<string> {
    return context.getTarget().getBlocks().createBlock(Variables.AddToList, this.getUnderlyingVariable(context), index);
  }

  replace(index: Input, item: Input, context: TranslationContext): Block<string> {
    return context.getTarget().getBlocks().createBlock(Variables.ReplaceItemOfList, this.getUnderlyingVariable(context), index, item);
  }

  performSideEffects(tail: Block, context: TranslationContext): void { }
}
