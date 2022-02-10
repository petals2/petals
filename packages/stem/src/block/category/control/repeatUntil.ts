import { Input } from "../../input";
import { Block } from "../../block";
import { BlockKind } from "../../kinds";

export class RepeatUntil extends BlockKind.C<"control_repeat_until"> {
  constructor(condition?: Block, substack?: Block) {
    super("control_repeat_until");

    if (condition) { this.setCondition(condition) }
    if (substack) { this.setSubstack(substack) }
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
        throw new Error("RepeatUntil CONDITION input is not a block");
      }

      return topLayer;
    }
  }

  setSubstack(substack: Block): this {
    substack.setParent(this);
    this.setInput("SUBSTACK", Input.unshadowed(substack));
    return this;
  }

  getSubstack(): Block | undefined {
    const input = this.getInput("SUBSTACK");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("RepeatUntil SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }
}
