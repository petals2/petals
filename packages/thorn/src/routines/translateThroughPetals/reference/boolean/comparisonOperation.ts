import {
  AnyInput,
  Block,
  Blocks,
  Input,
  NumberInput,
  StringInput,
  Target,
  Variable
} from "petals-stem";

import { getUnknownReference } from "..";
import { ValueTreeNode } from "../../../../types/ast/node";
import { BooleanType, NumberType } from "../../../../types/ast/type";
import { Context } from "../../context";
import { ListReference } from "../list/abstract";
import { VariableReference } from "../variable/abstract";
import { BooleanReference } from "./abstract";

export class BooleanComparisonOperationReference extends BooleanReference {
  protected listComparisonResult: VariableReference | undefined;
  protected rightHandRef: VariableReference | ListReference | BooleanReference;
  protected leftHandRef: VariableReference | ListReference | BooleanReference;

  constructor(
    leftHand: ValueTreeNode,
    rightHand: ValueTreeNode,
    protected readonly operation: "<=" | ">=" | "<" | ">" | "==" | "!=",
    target: Target,
    thread: Block,
    context: Context,
  ) {
    super();

    this.leftHandRef = getUnknownReference(leftHand, target, thread, context);
    this.rightHandRef = getUnknownReference(rightHand, target, thread, context);
  }

  computeListEquivalence(target: Target, thread: Block, context: Context): [requiresStorage: boolean, block: Block] {
    if (!this.listComparisonResult) this.listComparisonResult = context.createVariable("___listComparisonResult", 0, new BooleanType());

    if (!(this.leftHandRef instanceof ListReference && this.rightHandRef instanceof ListReference)) throw new Error("Compute list equivalence called on non-list comparison");

    if (this.operation !== "==" && this.operation !== "!=")
      throw new Error("Unsupported operation on lists: " + this.operation);

    let eq: Block;

    let requiresStorage = false;

    if (this.leftHandRef.isKnownLength() && this.rightHandRef.isKnownLength()) {
      requiresStorage = true;
      if (this.leftHandRef.getKnownLength(context) != this.rightHandRef.getKnownLength(context)) {
        eq = target.getBlocks().createBlock(Blocks.Operators.And);
      } else if (this.leftHandRef.getKnownLength(context) === 0) {
        eq = target.getBlocks().createBlock(Blocks.Operators.Not);
      } else {
        let remainingLength = this.leftHandRef.getKnownLength(context);
        let tri = 0;
        let tli = 0;

        let tr = this.rightHandRef.getItemAtIndex(Input.shadowed(new NumberInput(tri)), target, thread, context);
        let tl = this.leftHandRef.getItemAtIndex(Input.shadowed(new NumberInput(tli)), target, thread, context);

        if (tl instanceof ListReference || tr instanceof ListReference) throw new Error("I don't know when or why this would occur");

        tri++;
        tli++;

        eq = target.getBlocks().createBlock(Blocks.Operators.Equals, Input.shadowed(tl), Input.shadowed(tr));

        while (remainingLength > 1) {
          let tr = this.rightHandRef.getItemAtIndex(Input.shadowed(new NumberInput(tri)), target, thread, context);
          let tl = this.leftHandRef.getItemAtIndex(Input.shadowed(new NumberInput(tli)), target, thread, context);

          if (tl instanceof ListReference || tr instanceof ListReference) {
            if (tl instanceof ListReference) tli++;
            if (tr instanceof ListReference) tri++;
            continue;
          }

          eq = target.getBlocks().createBlock(Blocks.Operators.And, eq, target.getBlocks().createBlock(Blocks.Operators.Equals, Input.shadowed(tl), Input.shadowed(tr)));
          remainingLength--;
          tli++; tri++;
          continue;
        }
      }
    } else {
      if (!this.listComparisonResult) this.listComparisonResult = context.createVariable("___listComparisonResult", 0, new BooleanType());

      const index = context.createVariable("index", 1, new NumberType());

      thread.getTail().append(this.listComparisonResult.setValue(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Equals,
        Input.shadowed(this.leftHandRef.getLength(target, thread, context)),
        Input.shadowed(this.rightHandRef.getLength(target, thread, context)),
      )), target, thread, context));

      thread.getTail().append(index.setValue(Input.shadowed(new NumberInput(1)), target, thread, context));

      const phantom = target.getBlocks().createBlock(Blocks.Phantom);

      phantom.getTail().append(this.listComparisonResult.setValue(Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Equals,
        Input.shadowed(this.leftHandRef.getItemAtIndex(Input.shadowed(index.getValue(target, phantom, context)), target, phantom, context) as AnyInput),
        Input.shadowed(this.rightHandRef.getItemAtIndex(Input.shadowed(index.getValue(target, phantom, context)), target, phantom, context) as AnyInput),
      )), target, phantom, context));

      phantom.getTail().append(index.changeValue(Input.shadowed(new NumberInput(1)), target, phantom, context));

      thread.getTail().append(target.getBlocks().createBlock(Blocks.Control.While,
        target.getBlocks().createBlock(Blocks.Operators.Equals, Input.shadowed(this.listComparisonResult.getValue(target, thread, context)), Input.shadowed(new StringInput("true"))),
        phantom
      ))

      eq = target.getBlocks().createBlock(Blocks.Operators.Equals, Input.shadowed(this.listComparisonResult.getValue(target, thread, context)), Input.shadowed(new StringInput("true")));
    }

    if (this.operation === "!=")
      return [requiresStorage, target.getBlocks().createBlock(Blocks.Operators.Not, eq)];

    return [requiresStorage, eq];
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {
    if (this.leftHandRef instanceof BooleanReference) this.leftHandRef.performSideEffects(target, thread, context);
    if (this.rightHandRef instanceof BooleanReference) this.rightHandRef.performSideEffects(target, thread, context);

    if (!(this.leftHandRef instanceof ListReference && this.rightHandRef instanceof ListReference)) return;

    // at least one of our references is a list

    if (!this.listComparisonResult) this.listComparisonResult = context.createVariable("___listComparisonResult", 0, new BooleanType());

    const [requiresStorage, value] = this.computeListEquivalence(target, thread, context);

    if (requiresStorage) {
      this.listComparisonResult.setValue(Input.shadowed(value), target, thread, context);
    }
  }

  getValue(target: Target, thread: Block, context: Context): Block {
    if (this.leftHandRef instanceof ListReference || this.rightHandRef instanceof ListReference) {
      if (!(this.leftHandRef instanceof ListReference && this.rightHandRef instanceof ListReference)) return target.getBlocks().createBlock(Blocks.Operators.And);

      if (this.listComparisonResult)
        return target.getBlocks().createBlock(Blocks.Operators.Equals, Input.shadowed(this.listComparisonResult.getValue(target, thread, context)), Input.shadowed(new StringInput("true")));

      return this.computeListEquivalence(target, thread, context)[1];
    }

    switch (this.operation) {
      case "==": return target.getBlocks().createBlock(Blocks.Operators.Equals, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context)));
      case "!=": return target.getBlocks().createBlock(Blocks.Operators.Not, target.getBlocks().createBlock(Blocks.Operators.Equals, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context))));
      case "<": return target.getBlocks().createBlock(Blocks.Operators.Lt, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context)));
      case ">": return target.getBlocks().createBlock(Blocks.Operators.Gt, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context)));
      case ">=": return target.getBlocks().createBlock(Blocks.Operators.Not, target.getBlocks().createBlock(Blocks.Operators.Lt, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context))));
      case "<=": return target.getBlocks().createBlock(Blocks.Operators.Not, target.getBlocks().createBlock(Blocks.Operators.Gt, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context))));
    }

    throw new Error("Unsupported operation");
  }
}