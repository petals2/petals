import { AngleInput } from "../../input/angle";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class TurnRight extends BlockKind.Stack<"motion_turnright"> {
  constructor(degrees: number | Input = 15) {
    super("motion_turnright");

    this.setDegrees(degrees);
  }

  setDegrees(degrees: number | Input): this {
    if (typeof degrees === "number") {
      degrees = Input.shadowed(new AngleInput(degrees));
    }

    // block checking
    degrees.link(this);

    this.setInput("DEGREES", degrees);

    return this;
  }

  getDegrees(): Input {
    return this.getInput("DEGREES")!;
  }
}
