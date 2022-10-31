import { Block, Input } from "petals-stem";
import { Operators } from "petals-stem/dist/src/block";
import { MathOperationNode } from "../../../ast/node/mathOperation";
import { TranslationContext } from "../../../translate/context";
import { getType } from "../../../type";
import { ConstArrayReference } from "../array/arrayReference";
import { getUnknownReference, UnknownReference } from "../unknown";
import { ConstReporterReference } from "./reporterReference";

export class MathOpReference extends ConstReporterReference {
  protected hasPerformedSideEffect: boolean = false;
  protected leftHandReference: UnknownReference | undefined = undefined;
  protected rightHandReference: UnknownReference | undefined = undefined;

  constructor(protected readonly node: MathOperationNode) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    if (!this.hasPerformedSideEffect)
      this.performSideEffects(sideEffectTail, context);

    const Operation = {
      "+": getType(this.node, context).isStringType() ? Operators.Join : Operators.Add,
      "-": Operators.Subtract,
      "/": Operators.Divide,
      "*": Operators.Multiply,
    }[this.node.getOperation()];

    const lhr = this.leftHandReference!;
    const rhr = this.rightHandReference!;

    if (lhr instanceof ConstArrayReference || rhr instanceof ConstArrayReference) {
      throw new Error("TODO");
    }

    return Input.shadowed(context.getTarget().getBlocks().createBlock(Operation, lhr.getValue(sideEffectTail, context), rhr.getValue(sideEffectTail, context)))
  }

  performSideEffects(tail: Block<string>, context: TranslationContext): void {
    this.hasPerformedSideEffect = true;

    this.leftHandReference = getUnknownReference(this.node.getLeftHand(), tail, context);
    this.rightHandReference = getUnknownReference(this.node.getRightHand(), tail, context);

    this.leftHandReference.performSideEffects(tail, context);
    this.rightHandReference.performSideEffects(tail, context);
  }
}
