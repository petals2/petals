import { Block, Input } from "petals-stem";
import { Operators, Variables } from "petals-stem/dist/src/block";
import { getReporterReference } from ".";
import { IdentifierNode } from "../../../ast/node/identifier";
import { IndexReferenceNode } from "../../../ast/node/indexReference";
import { LiteralNode } from "../../../ast/node/literal";
import { MathOperationNode } from "../../../ast/node/mathOperation";
import { TokenRange } from "../../../lexer/token";
import { TranslationContext } from "../../../translate/context";
import { ThornFunctionRefrence } from "../../thorn/function";
import { getArrayReference } from "../array";
import { type ArrayReference, type ConstArrayReference } from "../array/arrayReference";
import { ConstBooleanReference } from "../boolean/booleanReference";
import { UnknownReference } from "../unknown";
import { MathOpReference } from "./mathop";
import { ConstReporterReference, ReporterReference } from "./reporterReference";

export class ConstIndexReference extends ConstReporterReference {
  list: ConstArrayReference | ArrayReference | undefined;
  index: ConstReporterReference | ReporterReference | undefined;

  constructor(protected readonly node: IndexReferenceNode) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    if (!this.list) this.performSideEffects(sideEffectTail, context);

    return this.list!.getValue(sideEffectTail, Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Add, this.index!.getValue(sideEffectTail, context), 1)), context);
  }

  performSideEffects(tail: Block, context: TranslationContext): void {
    this.list = getArrayReference(this.node.getBase(), tail.getTail(), context);
    this.list.performSideEffects(tail.getTail(), context);
    this.index = getReporterReference(this.node.getIndex(), tail.getTail(), context);
    this.index.performSideEffects(tail.getTail(), context);
  }
}

// export class IdentifierReference extends ReporterReference {
//   constructor(protected readonly identifier: IdentifierNode) { super() }

//   getValue(sideEffectTail: Block, context: TranslationContext): Input {
//     return context.resolveIdentifier(this.identifier).getScratchValueReference();
//   }

//   performSideEffects(tail: Block, context: TranslationContext): void { }

//   setValue(sideEffectTail: Block, reference: ConstReporterReference, context: TranslationContext): void {
//     const resolved = context.resolveIdentifier(this.identifier);

//     if (resolved instanceof ThornFunctionRefrence) {
//       throw new Error("Figure out when this error throws");
//     }

//     sideEffectTail.getTail().append(resolved.setScratchValue(reference, context));
//   }

//   mutateValue(mutation: "*" | "/" | "+" | "-", tail: Block<string>, reference: UnknownReference, context: TranslationContext): void {
//     const resolved = context.resolveIdentifier(this.identifier);

//     if (resolved instanceof ThornFunctionRefrence) {
//       throw new Error("Figure out when this error throws");
//     }

//     if (reference instanceof ConstBooleanReference) {
//       throw new Error("Cannot mutate by a boolean");
//     }

//     switch (mutation) {
//       case "+":
//         tail.getTail().append(resolved.changeScratchValue(reference, context));
//         return
//     }
//   }
// }
