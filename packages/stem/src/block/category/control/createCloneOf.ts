import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class CreateCloneOf extends BlockKind.Stack {
  constructor(cloneOption: Input) {
    super("control_create_clone_of");

    this.setCloneOption(cloneOption);
  }

  setCloneOption(cloneOption: Input): this {
    cloneOption.link(this);

    this.setInput("CLONE_OPTION", cloneOption);

    return this;
  }

  getCloneOption(): Input {
    return this.getInput("CLONE_OPTION")!;
  }
}
