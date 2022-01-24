import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class SwitchBackdropToAndWait extends BlockKind.Stack {
  constructor(backdrop: Input) {
    super("looks_switchbackdroptoandwait");

    this.setBackdrop(backdrop);
  }

  setBackdrop(backdrop: Input): this {
    backdrop.link(this);

    this.setInput("BACKDROP", backdrop);

    return this;
  }

  getBackdrop(): Input {
    return this.getInput("BACKDROP")!;
  }

  isYieldPoint() {
    return true;
  }
}
