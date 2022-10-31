import { Block, Input, List } from "petals-stem";
import { Operators, StringInput, VariableInput, Variables } from "petals-stem/dist/src/block";
import { IdentifierNode } from "../../../ast/node/identifier";
import { LiteralNode } from "../../../ast/node/literal";
import { MathOperationNode } from "../../../ast/node/mathOperation";
import { TokenRange } from "../../../lexer/token";
import { TranslationContext } from "../../../translate/context";
import { ThornFunctionRefrence } from "../../thorn/function";
import { ConstArrayReference } from "../array/arrayReference";
import { ConstBooleanReference } from "../boolean/booleanReference";
import { UnknownReference } from "../unknown";
import { MathOpReference } from "./mathop";
import { ConstReporterReference, ReporterReference } from "./reporterReference";

export class ConstIdentifierReference extends ConstReporterReference {
  constructor(protected readonly identifier: IdentifierNode) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    const res = context.resolveIdentifier(this.identifier);

    if (res instanceof ThornFunctionRefrence) {
      throw new Error("TODO");
    }

    const resv = res.getScratchValue();

    if (resv instanceof List) {
      throw new Error("Scratch lists cannot be referenced by identifier");
    }

    return Input.shadowed(new VariableInput(resv));
  }

  performSideEffects(tail: Block, context: TranslationContext): void {}
}

export class IdentifierReference extends ReporterReference {
  constructor(protected readonly identifier: IdentifierNode) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    const res = context.resolveIdentifier(this.identifier);

    if (res instanceof ThornFunctionRefrence) {
      throw new Error("TODO");
    }

    const resv = res.getScratchValue();

    if (resv instanceof List) {
      throw new Error("Scratch lists cannot be referenced by identifier");
    }

    return Input.shadowed(new VariableInput(resv));
  }

  performSideEffects(tail: Block, context: TranslationContext): void { }

  setValue(sideEffectTail: Block, reference: ConstReporterReference, context: TranslationContext): void {
    const res = context.resolveIdentifier(this.identifier);

    if (res instanceof ThornFunctionRefrence) {
      throw new Error("TODO: Figure out")
    }

    const resv = res.getScratchValue();

    if (resv instanceof List) {
      throw new Error("Scratch lists cannot be referenced by identifier");
    }

    sideEffectTail.getTail().append(context.getTarget().getBlocks().createBlock(Variables.SetVariableTo, resv, reference.getValue(sideEffectTail, context)));
  }

  mutateValue(mutation: "*" | "/" | "+" | "-", tail: Block<string>, reference: UnknownReference, context: TranslationContext): void {
    const resolved = context.resolveIdentifier(this.identifier);

    if (resolved instanceof ThornFunctionRefrence) {
      throw new Error("Figure out when this error throws");
    }

    if (reference instanceof ConstBooleanReference) {
      throw new Error("Cannot mutate by a boolean");
    }

    if (reference instanceof ConstArrayReference) {
      throw new Error("Cannot mutate by a array");
    }

    const x = resolved.getScratchValue();

    if (x instanceof List) {
      throw new Error("Cannot mutuate an array");
    }

    const v = reference.getValue(tail.getTail(), context);

    switch(mutation) {
      case "+":
        tail.getTail().append(context.getTarget().getBlocks().createBlock(Variables.ChangeVariableBy, x, v));
        return;
      case "-":
        tail.getTail().append(context.getTarget().getBlocks().createBlock(Variables.ChangeVariableBy, x, Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Multiply, v, -1))));
        return;
      case "*":
        tail.getTail().append(context.getTarget().getBlocks().createBlock(Variables.SetVariableTo, x, Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Multiply, v, Input.shadowed(new VariableInput(x))))));
        return;
      case "/":
        tail.getTail().append(context.getTarget().getBlocks().createBlock(Variables.SetVariableTo, x, Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Divide, Input.shadowed(new VariableInput(x)), v))));
        return;
    }
  }
}
