import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class MoveSteps extends BlockKind.Stack<"motion_movesteps"> {
  constructor(steps: number | Input = 10) {
    super("motion_movesteps");

    this.setSteps(steps);
  }

  setSteps(steps: number | Input): this {
    if (typeof steps === "number") {
      steps = Input.shadowed(new NumberInput(steps));
    }

    // block checking
    steps.link(this);

    this.setInput("STEPS", steps);

    return this;
  }

  getSteps(): Input {
    return this.getInput("STEPS")!;
  }
}
