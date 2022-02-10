import { Input } from "../../input";
import { Block } from "../../block";
import { BlockKind } from "../../kinds";

export class IfElse extends BlockKind.E<"control_if_else"> {
  constructor(condition?: Block, substackTrue?: Block, substackFalse?: Block) {
    super("control_if_else");

    if (condition) { this.setCondition(condition) }
    if (substackTrue) { this.setSubstackTrue(substackTrue) }
    if (substackFalse) { this.setSubstackFalse(substackFalse) }
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
        throw new Error("IfElse CONDITION input is not a block");
      }

      return topLayer;
    }
  }

  setSubstackTrue(substackTrue: Block): this {
    substackTrue.setParent(this);
    this.setInput("SUBSTACK", Input.unshadowed(substackTrue));
    return this;
  }

  getSubstackTrue(): Block | undefined {
    const input = this.getInput("SUBSTACK");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("IfElse SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }

  setSubstackFalse(substackFalse: Block): this {
    substackFalse.setParent(this);
    this.setInput("SUBSTACK2", Input.unshadowed(substackFalse));
    return this;
  }

  getSubstackFalse(): Block | undefined {
    const input = this.getInput("SUBSTACK2");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("IfElse SUBSTACK2 input is not a block");
      }

      return topLayer;
    }
  }
}
