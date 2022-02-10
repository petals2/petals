import { Block } from "../../block";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class Or extends BlockKind.Boolean<"operator_or"> {
  constructor(operand1?: Block, operand2?: Block) {
    super("operator_or");

    if (operand1) this.setOperand1(operand1);
    if (operand2) this.setOperand2(operand2);
  }

  setOperand1(operand1: Block): this {
    operand1.setParent(this);
    this.setInput("OPERAND1", Input.unshadowed(operand1));

    return this;
  }

  getOperand1(): Block | undefined {
    const input = this.getInput("OPERAND1");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Or OPERAND1 input is not a block");
      }

      return topLayer;
    }
  }

  setOperand2(operand2: Block): this {
    operand2.setParent(this);
    this.setInput("OPERAND2", Input.unshadowed(operand2));

    return this;
  }

  getOperand2(): Block | undefined {
    const input = this.getInput("OPERAND2");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Or OPERAND2 input is not a block");
      }

      return topLayer;
    }
  }
}
