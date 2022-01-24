import { AngleInput } from "../../input/angle";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class PointInDirection extends BlockKind.Stack {
  constructor(direction: number | Input = 90) {
    super("motion_pointindirection");

    this.setDirection(direction);
  }

  setDirection(direction: number | Input): this {
    if (typeof direction === "number") {
      direction = Input.shadowed(new AngleInput(direction));
    }

    // block checking
    direction.link(this);

    this.setInput("DIRECTION", direction);

    return this;
  }

  getDirection(): Input {
    return this.getInput("DIRECTION")!;
  }
}
