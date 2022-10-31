import { Block, Input, NumberInput, StringInput } from "petals-stem";
import { Operators, Petals } from "petals-stem/dist/src/block";
import { LiteralNode } from "../../../ast/node/literal";
import { TranslationContext } from "../../../translate/context";
import { ConstReporterReference } from "../reporter/reporterReference";
import { ConstBooleanReference } from "./booleanReference";

export class ReporterReference extends ConstBooleanReference {
  constructor(protected readonly reporter: ConstReporterReference) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    // return Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Equals, this.reporter.getValue(sideEffectTail, context), Input.shadowed(new StringInput("true"))));
    return this.reporter.getValue(sideEffectTail, context);
  }

  performSideEffects(tail: Block, context: TranslationContext): void {
    this.reporter.performSideEffects(tail.getTail(), context);
  }
}
