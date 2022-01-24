import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class Divide extends BlockKind.Reporter {
  constructor(num1: number | Input = 0, num2: number | Input = 0) {
    super("operator_divide");

    this.setNum1(num1);
    this.setNum2(num2);
  }

  setNum1(num1: number | Input): this {
    if (typeof num1 === "number") {
      num1 = Input.shadowed(new NumberInput(num1));
    }

    // block checking
    num1.link(this);

    this.setInput("NUM1", num1);

    return this;
  }

  getNum1(): Input {
    return this.getInput("NUM1")!;
  }

  setNum2(num2: number | Input): this {
    if (typeof num2 === "number") {
      num2 = Input.shadowed(new NumberInput(num2));
    }

    // block checking
    num2.link(this);

    this.setInput("NUM2", num2);

    return this;
  }

  getNum2(): Input {
    return this.getInput("NUM2")!;
  }
}
