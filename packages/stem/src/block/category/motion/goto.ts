import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class Goto extends BlockKind.Stack {
  constructor(to: Input) {
    super("motion_goto");

    this.setTo(to);
  }

  setTo(to: Input): this {
    to.link(this);

    this.setInput("TO", to);

    return this;
  }

  getTo(): Input {
    return this.getInput("TO")!;
  }
}
