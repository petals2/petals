import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class ChangeYBy extends BlockKind.Stack<"motion_changeyby"> {
  constructor(dY: number | Input = 10) {
    super("motion_changeyby");

    this.setDy(dY);
  }

  setDy(dY: number | Input): this {
    if (typeof dY === "number") {
      dY = Input.shadowed(new NumberInput(dY));
    }

    // block checking
    dY.link(this);

    this.setInput("DY", dY);

    return this;
  }

  getDy(): Input {
    return this.getInput("DY")!;
  }
}
