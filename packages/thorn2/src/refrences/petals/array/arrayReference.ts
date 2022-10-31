import { Block, Input, Variable } from "petals-stem";
import { Control, VariableInput, Variables } from "petals-stem/dist/src/block";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { variableNames } from "../../../id";
import { TranslationContext } from "../../../translate/context";
import { UnknownReference } from "../unknown";

export abstract class ConstArrayReference {
  abstract getValue(sideEffectTail: Block, index: Input, context: TranslationContext): Input;
  abstract findValueIndex(sideEffectTail: Block, index: Input, context: TranslationContext): Input;
  abstract length(sideEffectTail: Block, context: TranslationContext): Input;
  abstract contains(sideEffectTail: Block, item: Input, context: TranslationContext): Input;
  abstract performSideEffects(tail: Block, context: TranslationContext): void;

  copyTo(array: ArrayReference, context: TranslationContext): Block {
    const phantom = context.getTarget().getBlocks().createBlock(Phantom);

    const index = context.getTarget().getVariables().createVariable(variableNames.generate(), 0);

    phantom.append(array.clear(context));
    phantom.getTail().append(context.getTarget().getBlocks().createBlock(Variables.SetVariableTo, index, 1));
    const length = this.length(phantom.getTail(), context);
    const v = this.getValue(phantom.getTail(), Input.shadowed(new VariableInput(index)), context);
    phantom.getTail().append(context.getTarget().getBlocks().createBlock(Control.Repeat, length, 
      array.push(v, context).append(context.getTarget().getBlocks().createBlock(Variables.ChangeVariableBy, index, 1)).getHead(),
    ))

    return phantom.getHead();
  }

  isWritable(): this is ArrayReference { return false }
}

export abstract class ArrayReference extends ConstArrayReference {
  abstract push(index: Input, context: TranslationContext): Block;
  abstract delete(index: Input, context: TranslationContext): Block;
  abstract clear(context: TranslationContext): Block;
  abstract insert(item: Input, index: Input, context: TranslationContext): Block;
  abstract replace(index: Input, item: Input, context: TranslationContext): Block;
  isWritable(): this is ArrayReference { return true }
}
