import { Block } from "petals-stem/dist/src/block";
import { Control } from "petals-stem/dist/src/block/category/control";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { Variables } from "petals-stem/dist/src/block/category/variables";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { StringInput } from "petals-stem/dist/src/block/input/string";
import { VariableInput } from "petals-stem/dist/src/block/input/variable";
import { ID } from "petals-stem/dist/src/id";
import { Target } from "petals-stem/dist/src/target";
import { Variable } from "petals-stem/dist/src/variable";
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
    context: Context,
  ) {
    super();

    this.leftHandRef = getUnknownReference(leftHand, context);
    this.rightHandRef = getUnknownReference(rightHand, context);
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
        eq = target.getBlocks().createBlock(Operators.And);
      } else if (this.leftHandRef.getKnownLength(context) === 0) {
        eq = target.getBlocks().createBlock(Operators.Not);
      } else {
        let remainingLength = this.leftHandRef.getKnownLength(context);
        let tri = 0;
        let tli = 0;

        let tr = this.rightHandRef.getItemAtIndex(Input.shadowed(new NumberInput(tri)), target, thread, context);
        let tl = this.leftHandRef.getItemAtIndex(Input.shadowed(new NumberInput(tli)), target, thread, context);

        if (tl instanceof ListReference || tr instanceof ListReference) throw new Error("I don't know when or why this would occur");

        tri++;
        tli++;

        eq = target.getBlocks().createBlock(Operators.Equals, Input.shadowed(tl), Input.shadowed(tr));

        while (remainingLength > 1) {
          let tr = this.rightHandRef.getItemAtIndex(Input.shadowed(new NumberInput(tri)), target, thread, context);
          let tl = this.leftHandRef.getItemAtIndex(Input.shadowed(new NumberInput(tli)), target, thread, context);

          if (tl instanceof ListReference || tr instanceof ListReference) {
            if (tl instanceof ListReference) tli++;
            if (tr instanceof ListReference) tri++;
            continue;
          }

          eq = target.getBlocks().createBlock(Operators.And, eq, target.getBlocks().createBlock(Operators.Equals, Input.shadowed(tl), Input.shadowed(tr)));
          remainingLength--;
          tli++; tri++;
          continue;
        }
      }
    } else {
      if (!this.listComparisonResult) this.listComparisonResult = context.createVariable("___listComparisonResult", 0, new BooleanType());

      const index = context.createVariable("index", 1, new NumberType());

      this.listComparisonResult.setValue(Input.shadowed(target.getBlocks().createBlock(Operators.Equals,
        Input.shadowed(this.leftHandRef.getLength(target, thread, context)),
        Input.shadowed(this.rightHandRef.getLength(target, thread, context)),
      )), target, thread, context);

      index.setValue(Input.shadowed(new NumberInput(1)), target, thread, context);

      const phantom = target.getBlocks().createBlock(Phantom);

      this.listComparisonResult.setValue(Input.shadowed(target.getBlocks().createBlock(Operators.Equals,
        Input.shadowed(this.leftHandRef.getItemAtIndex(Input.shadowed(index.getValue(target, phantom, context)), target, phantom, context) as AnyInput),
        Input.shadowed(this.rightHandRef.getItemAtIndex(Input.shadowed(index.getValue(target, phantom, context)), target, phantom, context) as AnyInput),
      )), target, phantom, context);

      index.changeValue(Input.shadowed(new NumberInput(1)), target, phantom, context);

      thread.getTail().append(target.getBlocks().createBlock(Control.While,
        target.getBlocks().createBlock(Operators.Equals, Input.shadowed(this.listComparisonResult.getValue(target, thread, context)), Input.shadowed(new StringInput("true"))),
        phantom
      ))

      eq = target.getBlocks().createBlock(Operators.Equals, Input.shadowed(this.listComparisonResult.getValue(target, thread, context)), Input.shadowed(new StringInput("true")));
    }

    if (this.operation === "!=")
      return [requiresStorage, target.getBlocks().createBlock(Operators.Not, eq)];

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
      if (!(this.leftHandRef instanceof ListReference && this.rightHandRef instanceof ListReference)) return target.getBlocks().createBlock(Operators.And);

      if (this.listComparisonResult)
        return target.getBlocks().createBlock(Operators.Equals, Input.shadowed(this.listComparisonResult.getValue(target, thread, context)), Input.shadowed(new StringInput("true")));

      return this.computeListEquivalence(target, thread, context)[1];
    }

    switch (this.operation) {
      case "==": return target.getBlocks().createBlock(Operators.Equals, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context)));
      case "!=": return target.getBlocks().createBlock(Operators.Not, target.getBlocks().createBlock(Operators.Equals, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context))));
      case "<": return target.getBlocks().createBlock(Operators.Lt, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context)));
      case ">": return target.getBlocks().createBlock(Operators.Gt, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context)));
      case ">=": return target.getBlocks().createBlock(Operators.Not, target.getBlocks().createBlock(Operators.Lt, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context))));
      case "<=": return target.getBlocks().createBlock(Operators.Not, target.getBlocks().createBlock(Operators.Gt, Input.shadowed(this.leftHandRef.getValue(target, thread, context)), Input.shadowed(this.rightHandRef.getValue(target, thread, context))));
    }

    throw new Error("Unsupported operation");
  }
}
