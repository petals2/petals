import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class SetY extends BlockKind.Stack<"motion_sety"> {
  constructor(y: number | Input = 0) {
    super("motion_sety");

    this.setY(y);
  }

  setY(y: number | Input): this {
    if (typeof y === "number") {
      y = Input.shadowed(new NumberInput(y));
    }

    // block checking
    y.link(this);

    this.setInput("Y", y);

    return this;
  }

  getY(): Input {
    return this.getInput("Y")!;
  }
}
