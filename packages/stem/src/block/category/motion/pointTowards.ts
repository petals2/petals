import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class PointTowards extends BlockKind.Stack<"motion_pointtowards"> {
  constructor(towards: Input) {
    super("motion_pointtowards");

    this.setTowards(towards);
  }

  setTowards(towards: Input): this {
    towards.link(this);

    this.setInput("TOWARDS", towards);

    return this;
  }

  getTowards(): Input {
    return this.getInput("TOWARDS")!;
  }
}
