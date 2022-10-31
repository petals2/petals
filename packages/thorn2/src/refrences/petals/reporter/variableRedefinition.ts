import { Block, Input, NumberInput, StringInput } from "petals-stem";
import { LiteralNode } from "../../../ast/node/literal";
import { VariableRedefinitionNode } from "../../../ast/node/variableRedefinition";
import { TranslationContext } from "../../../translate/context";
import { ConstArrayReference } from "../array/arrayReference";
import { BooleanReference } from "../boolean/booleanReference";
import { getUnknownReference } from "../unknown";
import { IdentifierReference } from "./identifier";
import { ConstReporterReference } from "./reporterReference";

export class VariableRedefinitionReference extends ConstReporterReference {
  protected sideEffectPreformed = false;
  protected value: Input | undefined = undefined;

  constructor(protected readonly node: VariableRedefinitionNode) { super() }

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

    if (assignedTo instanceof ConstArrayReference) {
      throw new Error("StateError: Cannot modify arrays in a reporter redefinition")
    }

    const assignValue = getUnknownReference(this.node.getValue(), tail.getTail(), context);

    if (this.node.getAssignmentMethod() === "=") {
      assignedTo.setValue(tail.getTail(), assignValue, context);
    } else {
      if (assignedTo instanceof BooleanReference) {
        throw new Error("Cannot mutuate a boolean");
      }

      assignedTo.mutateValue({
        "*=": "*",
        "/=": "/",
        "+=": "+",
        "-=": "-",
      }[this.node.getAssignmentMethod()] as any, tail.getTail(), assignValue, context)
    }

    this.value = assignedTo.getValue(tail.getTail(), context);
  }
}
