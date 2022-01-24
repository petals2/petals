import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class Lt extends BlockKind.Boolean {
  constructor(operand1: number | Input = 0, operand2: number | Input = 0) {
    super("operator_lt");

    this.setOperand1(operand1);
    this.setOperand2(operand2);
  }

  setOperand1(operand1: number | Input): this {
    if (typeof operand1 === "number") {
      operand1 = Input.shadowed(new NumberInput(operand1));
    }

    // block checking
    operand1.link(this);

    this.setInput("OPERAND1", operand1);

    return this;
  }

  getOperand1(): Input {
    return this.getInput("OPERAND1")!;
  }

  setOperand2(operand2: number | Input): this {
    if (typeof operand2 === "number") {
      operand2 = Input.shadowed(new NumberInput(operand2));
    }

    // block checking
    operand2.link(this);

    this.setInput("OPERAND2", operand2);

    return this;
  }

  getOperand2(): Input {
    return this.getInput("OPERAND2")!;
  }
}
