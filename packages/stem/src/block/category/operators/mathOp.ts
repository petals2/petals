import { ValueField } from "../../field/value";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export enum MathOperation {
  Abs = "abs",
  Floor = "floor",
  Ceiling = "ceiling",
  Sqrt = "sqrt",
  Sin = "sin",
  Cos = "cos",
  Tan = "tan",
  Asin = "asin",
  Acos = "acos",
  Atan = "atan",
  Ln = "ln",
  Log = "log",
  EPow = "e ^",
  TenPow = "10 ^",
}

export class MathOp extends BlockKind.Reporter<"operator_mathop"> {
  constructor(operation: MathOperation = MathOperation.Abs, num: number | Input = 0) {
    super("operator_mathop");

    this.setOperation(operation);
    this.setNum(num);
  }

  setOperation(operation: MathOperation): this {
    this.setField("OPERATOR", new ValueField(operation));

    return this;
  }

  getOperation(): MathOperation {
    const field = this.getField("OPERATOR")!;

    if (!(field instanceof ValueField)) {
      throw new Error("Stop OPERATOR field is not a value field");
    }

    return field.getValue() as MathOperation;
  }

  setNum(num: number | Input): this {
    if (typeof num === "number") {
      num = Input.shadowed(new NumberInput(num));
    }

    // block checking
    num.link(this);

    this.setInput("NUM", num);

    return this;
  }

  getNum(): Input {
    return this.getInput("NUM")!;
  }
}
