import { Block, Input, NumberInput, StringInput } from "petals-stem";
import { LiteralNode } from "../../../ast/node/literal";
import { TranslationContext } from "../../../translate/context";
import { ConstReporterReference } from "./reporterReference";

export class LiteralReference extends ConstReporterReference {
  constructor(protected readonly literal: LiteralNode | number | boolean | string) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    let value = typeof this.literal === "object" ? this.literal.getValue() : this.literal;

    if (typeof value === "boolean") {
      value = value ? "true" : "false";
    }

    if (typeof value === "string") {
      return Input.shadowed(new StringInput(value));
    }

    return Input.shadowed(new NumberInput(value));
  }

  performSideEffects(tail: Block, context: TranslationContext): void { }
}
