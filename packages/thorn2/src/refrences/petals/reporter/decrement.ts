import { Block, Input, NumberInput, StringInput } from "petals-stem";
import { DecrementNode } from "../../../ast/node/decrement";
import { IncrementNode } from "../../../ast/node/increment";
import { LiteralNode } from "../../../ast/node/literal";
import { VariableRedefinitionNode } from "../../../ast/node/variableRedefinition";
import { TranslationContext } from "../../../translate/context";
import { BooleanReference, ConstBooleanReference } from "../boolean/booleanReference";
import { LiteralReference } from "./literal";
import { getUnknownReference } from "../unknown";
import { IdentifierReference } from "./identifier";
import { ConstReporterReference } from "./reporterReference";
import { ConstArrayReference } from "../array/arrayReference";

export class DecrementReference extends ConstReporterReference {
  protected sideEffectPreformed = false;
  protected value: Input | undefined = undefined;

  constructor(protected readonly node: DecrementNode) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    if (!this.sideEffectPreformed)
      this.performSideEffects(sideEffectTail, context);

    return this.value!;
  }

  performSideEffects(tail: Block, context: TranslationContext): void {
    this.sideEffectPreformed = true;

    const assignedTo = getUnknownReference(this.node.getBase(), tail.getTail(), context);

    if (!assignedTo.isWritable()) {
      throw new Error("Cannot assign to a constant");
    }

    if (assignedTo instanceof ConstBooleanReference) {
      throw new Error("Cannot increment boolean references");
    }

    if (assignedTo instanceof ConstArrayReference) {
      throw new Error("Cannot increment array references");
    }

    assignedTo.mutateValue("+", tail, new LiteralReference(-1), context)

    this.value = assignedTo.getValue(tail.getTail(), context);
  }
}
