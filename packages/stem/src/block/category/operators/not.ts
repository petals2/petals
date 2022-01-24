import { Block } from "../..";
import { Equivalence, getInputsEquivalence } from "../../helpers";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class Not extends BlockKind.Boolean {
  constructor(operand?: Block) {
    super("operator_not");

    if (operand) this.setOperand(operand);
  }

  getEquivalence(other: Block): Equivalence {
    if (!(other instanceof Not))
      return Equivalence.NotEquivalent;

    const tOp = this.getOperand();
    const oOp = other.getOperand();

    if (tOp === undefined && oOp === undefined)
      return Equivalence.Equivalent;

    if (tOp === undefined || oOp === undefined)
      return Equivalence.NotEquivalent;

    return getInputsEquivalence(tOp, oOp);
  }

  setOperand(operand: Block): this {
    operand.setParent(this);
    this.setInput("OPERAND", Input.unshadowed(operand));

    return this;
  }

  getOperand(): Block | undefined {
    const input = this.getInput("OPERAND");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Or OPERAND input is not a block");
      }

      return topLayer;
    }
  }
}
