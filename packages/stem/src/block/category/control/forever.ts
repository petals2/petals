import { Input } from "../../input";
import { Block } from "../..";
import { BlockKind } from "../../kinds";

export class Forever extends BlockKind.C {
  constructor(substack?: Block) {
    super("control_forever");

    if (substack) { this.setSubstack(substack) }
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
        throw new Error("Forever SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }
}
