import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class SwitchBackdropTo extends BlockKind.Stack<"looks_switchbackdropto"> {
  constructor(backdrop: Input) {
    super("looks_switchbackdropto");

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
}
