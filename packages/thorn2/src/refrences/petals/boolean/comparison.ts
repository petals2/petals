import { Block, Input } from "petals-stem";
import { Operators } from "petals-stem/dist/src/block";
import { ComparisonNode } from "../../../ast/node/comparison";
import { TranslationContext } from "../../../translate/context";
import { getType } from "../../../type";
import { ConstArrayReference } from "../array/arrayReference";
import { getUnknownReference, UnknownReference } from "../unknown";
import { ConstBooleanReference } from "./booleanReference";

export class ComparisonReference extends ConstBooleanReference {
  protected hasPerformedSideEffect: boolean = false;
  leftHandReference: UnknownReference | undefined = undefined;
  protected rightHandReference: UnknownReference | undefined = undefined;

  constructor(protected readonly node: ComparisonNode) { super() }

  getValue(sideEffectTail: Block, context: TranslationContext): Input {
    if (!this.hasPerformedSideEffect)
      this.performSideEffects(sideEffectTail, context);
    
    const lhr = this.leftHandReference!;
    const rhr = this.rightHandReference!;

    if (lhr instanceof ConstArrayReference || rhr instanceof ConstArrayReference) {
      throw new Error("TODO")
    }

    switch (this.node.getCondition()) {
      case "==": return Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Equals, lhr.getValue(sideEffectTail, context), rhr.getValue(sideEffectTail, context)));
      case "!=": return Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Not, context.getTarget().getBlocks().createBlock(Operators.Equals, lhr.getValue(sideEffectTail, context), rhr.getValue(sideEffectTail, context))));
      case "<": return Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Lt, lhr.getValue(sideEffectTail, context), rhr.getValue(sideEffectTail, context)));
      case "<=": return Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Not, context.getTarget().getBlocks().createBlock(Operators.Gt, lhr.getValue(sideEffectTail, context), rhr.getValue(sideEffectTail, context))));
      case ">": return Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Gt, lhr.getValue(sideEffectTail, context), rhr.getValue(sideEffectTail, context)));
      case ">=": return Input.shadowed(context.getTarget().getBlocks().createBlock(Operators.Not, context.getTarget().getBlocks().createBlock(Operators.Lt, lhr.getValue(sideEffectTail, context), rhr.getValue(sideEffectTail, context))));
    }
  }

  performSideEffects(tail: Block<string>, context: TranslationContext): void {
    this.hasPerformedSideEffect = true;

    this.leftHandReference = getUnknownReference(this.node.getLeftHand(), tail, context);
    this.rightHandReference = getUnknownReference(this.node.getRightHand(), tail, context);

    this.leftHandReference.performSideEffects(tail, context);
    this.rightHandReference.performSideEffects(tail, context);
  }
}
