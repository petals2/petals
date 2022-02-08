import { Input } from "../../input";
import { Block } from "../..";
import { BlockKind } from "../../kinds";

export class If extends BlockKind.C<"control_if"> {
  constructor(condition?: Block, substack?: Block) {
    super("control_if");

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
        throw new Error("If CONDITION input is not a block");
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
        throw new Error("If SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }
}
