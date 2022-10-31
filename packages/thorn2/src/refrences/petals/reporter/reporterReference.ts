import { Block, Input } from "petals-stem";
import { TranslationContext } from "../../../translate/context";
import { UnknownReference } from "../unknown";

export abstract class ConstReporterReference {
  abstract getValue(sideEffectTail: Block, context: TranslationContext): Input;
  abstract performSideEffects(tail: Block, context: TranslationContext): void;
  isWritable(): this is ReporterReference { return false }
}

export abstract class ReporterReference extends ConstReporterReference {
  abstract setValue(sideEffectTail: Block, reference: UnknownReference, context: TranslationContext): void;
  abstract mutateValue(mutation: "*" | "/" | "+" | "-", sideEffectTail: Block, reference: UnknownReference, context: TranslationContext): void;
  isWritable(): this is ReporterReference { return true }
}
