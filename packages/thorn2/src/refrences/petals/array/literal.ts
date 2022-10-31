import { Block, Input, List, NumberInput, StringInput } from "petals-stem";
import { Petals, Variables } from "petals-stem/dist/src/block";
import { ArrayLiteralNode } from "../../../ast/node/arrayLiteral";
import { LiteralNode } from "../../../ast/node/literal";
import { listNames } from "../../../id";
import { TranslationContext } from "../../../translate/context";
import { getReporterReference } from "../reporter";
import { ConstArrayReference } from "./arrayReference";

export class LiteralReference extends ConstArrayReference {
  protected list: List | undefined;

  constructor(protected readonly literal: ArrayLiteralNode) { super() }

  contains(sideEffectTail: Block, item: Input, context: TranslationContext): Input {
    if (this.list == undefined) this.performSideEffects(sideEffectTail, context);

    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ListContainsItem, this.list!, item));
  }

  findValueIndex(sideEffectTail: Block<string>, index: Input, context: TranslationContext): Input {
    if (this.list == undefined) this.performSideEffects(sideEffectTail, context);

    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ItemNumOfList, this.list!, index));
  }

  getValue(sideEffectTail: Block<string>, index: Input, context: TranslationContext): Input {
    if (this.list == undefined) this.performSideEffects(sideEffectTail, context);

    return Input.shadowed(context.getTarget().getBlocks().createBlock(Variables.ItemOfList, this.list!, index));
  }

  length(sideEffectTail: Block<string>, context: TranslationContext): Input {
    return Input.shadowed(new NumberInput(this.literal.getContents().length));
  }

  performSideEffects(tail: Block, context: TranslationContext): void {
    this.list = context.getTarget().getLists().createList(listNames.generate());
    tail.getTail().append(context.getTarget().getBlocks().createBlock(Variables.DeleteAllOfList, this.list));

    for (const item of this.literal.getContents()) {
      const ref = getReporterReference(item, tail.getTail(), context);
      const val = ref.getValue(tail.getTail(), context)

      tail.getTail().append(context.getTarget().getBlocks().createBlock(Variables.AddToList, this.list, val));
    }
  }
}
