import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class Round extends BlockKind.Reporter<"operator_round"> {
  constructor(num: number | Input = 0) {
    super("operator_round");

    this.setNum(num);
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
