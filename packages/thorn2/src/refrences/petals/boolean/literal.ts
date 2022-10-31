import { Block, Input, NumberInput, StringInput } from "petals-stem";
import { Petals } from "petals-stem/dist/src/block";
import { LiteralNode } from "../../../ast/node/literal";
import { TranslationContext } from "../../../translate/context";
import { ConstBooleanReference } from "./booleanReference";

export class LiteralReference extends ConstBooleanReference {
  constructor(protected readonly literal: LiteralNode | boolean) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    let value = typeof this.literal === "object" ? this.literal.getValue() : this.literal;

    return Input.shadowed(context.getTarget().getBlocks().createBlock(value ? Petals.LiteralTrue : Petals.LiteralFalse))
  }

  performSideEffects(tail: Block, context: TranslationContext): void { }
}
