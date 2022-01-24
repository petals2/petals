import { NumberInput } from "../../input/number";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class GlideTo extends BlockKind.Stack {
  constructor(secs: number | Input = 1, to: Input) {
    super("motion_glideto");

    this.setSecs(secs);
    this.setTo(to);
  }

  setSecs(secs: number | Input): this {
    if (typeof secs === "number") {
      secs = Input.shadowed(new NumberInput(secs));
    }

    // block checking
    secs.link(this);

    this.setInput("SECS", secs);

    return this;
  }

  getSecs(): Input {
    return this.getInput("SECS")!;
  }

  setTo(to: Input): this {
    to.link(this);

    this.setInput("TO", to);

    return this;
  }

  getTo(): Input {
    return this.getInput("TO")!;
  }

  isYieldPoint() {
    return true;
  }
}
