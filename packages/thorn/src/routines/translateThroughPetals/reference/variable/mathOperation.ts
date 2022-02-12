import { Block } from "petals-stem/dist/src/block";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { AnyInput, Input } from "petals-stem/dist/src/block/input";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { Target } from "petals-stem/dist/src/target";
import { getVariableReference } from ".";
import { ValueTreeNode } from "../../../../types/ast/node";
import { Context } from "../../context";
import { getType } from "../../getType";
import { VariableReference } from "./abstract";

export class MathOperationReference extends VariableReference {
  protected readonly operation: "+" | "-" | "*" | "/";

  protected readonly leftHandRef: VariableReference;
  protected readonly rightHandRef: VariableReference;

  constructor(
    protected leftHand: ValueTreeNode,
    protected rightHand: ValueTreeNode,
    operation: "--" | "++" | "+" | "-" | "*" | "/" | "!",
    target: Target,
    thread: Block,
    context: Context,
  ) {
    super();

    if (operation === "--" || operation === "++" || operation === "!") {
      throw new Error("Failed to translate operation: " + operation);
    }

    this.operation = operation;

    this.leftHandRef = getVariableReference(leftHand, target, thread, context);
    this.rightHandRef = getVariableReference(rightHand, target, thread, context);
  }

  performSideEffects(target: Target, thread: Block, context: Context): void {
    this.leftHandRef.performSideEffects(target, thread, context);
    this.rightHandRef.performSideEffects(target, thread, context);
  }

  getValue(target: Target, thread: Block, context: Context): AnyInput {
    const leftHand = this.leftHandRef.getValue(target, thread, context);
    const rightHand = this.rightHandRef.getValue(target, thread, context);

    if (this.operation === "+") {
      const leftType = getType(this.leftHand, context);
      const rightType = getType(this.rightHand, context);

      if (leftType.isNumberType() && rightType.isNumberType()) {
        return target.getBlocks().createBlock(Operators.Add, Input.shadowed(leftHand), Input.shadowed(rightHand));
      } else {
        return target.getBlocks().createBlock(Operators.Join, Input.shadowed(leftHand), Input.shadowed(rightHand));
      }
    }

    if (this.operation === "-") {
      return target.getBlocks().createBlock(Operators.Subtract, Input.shadowed(leftHand), Input.shadowed(rightHand));
    }

    if (this.operation === "*") {
      return target.getBlocks().createBlock(Operators.Multiply, Input.shadowed(leftHand), Input.shadowed(rightHand));
    }

    if (this.operation === "/") {
      return target.getBlocks().createBlock(Operators.Divide, Input.shadowed(leftHand), Input.shadowed(rightHand));
    }

    throw new Error("Cannot translate operation: " + this.operation);
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot set the value of a math operation");
  }

  changeValue(value: Input, target: Target, thread: Block, context: Context): Block {
    throw new Error("Cannot change the value of a math operation");
  }
}
