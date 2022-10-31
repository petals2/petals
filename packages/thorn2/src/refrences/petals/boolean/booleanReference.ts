import { Block, Input } from "petals-stem";
import { TranslationContext } from "../../../translate/context";
import { UnknownReference } from "../unknown";

export abstract class ConstBooleanReference {
  abstract getValue(sideEffectTail: Block, context: TranslationContext): Input;
  abstract performSideEffects(tail: Block, context: TranslationContext): void;
  isWritable(): this is BooleanReference { return false }
}

export abstract class BooleanReference extends ConstBooleanReference {
  abstract setValue(sideEffectTail: Block, reference: UnknownReference, context: TranslationContext): void;
  isWritable(): this is BooleanReference { return true }
}
