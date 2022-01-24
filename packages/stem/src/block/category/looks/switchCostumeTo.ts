import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class SwitchCostumeTo extends BlockKind.Stack {
  constructor(costume: Input) {
    super("looks_switchcostumeto");

    this.setCostume(costume);
  }
  
  setCostume(costume: Input): this {
    costume.link(this);

    this.setInput("COSTUME", costume);

    return this;
  }

  getCostume(): Input {
    return this.getInput("COSTUME")!;
  }
}
