import { Input } from "../../input";
import { Block } from "../../block";
import { BlockKind } from "../../kinds";

export class WaitUntil extends BlockKind.Stack<"control_wait_until"> {
  constructor(condition?: Block) {
    super("control_wait_until");

    if (condition) { this.setCondition(condition) }
  }

  setCondition(condition: Block): this {
    condition.setParent(this);
    this.setInput("CONDITION", Input.unshadowed(condition));
    return this;
  }

  getCondition(): Block | undefined {
    const input = this.getInput("CONDITION");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("WaitUntil CONDITION input is not a block");
      }

      return topLayer;
    }
  }

  isYieldPoint() {
    return true;
  }
}
