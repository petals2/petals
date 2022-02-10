import { NumberInput } from "../../input/number";
import { Input } from "../../input";
import { Block } from "../../block";
import { BlockKind } from "../../kinds";

export class Repeat extends BlockKind.C<"control_repeat"> {
  constructor(times: Input | number = 10, substack?: Block) {
    super("control_repeat");

    this.setTimes(times);

    if (substack) { this.setSubstack(substack) }
  }

  setTimes(times: Input | number): this {
    if (typeof times === "number") {
      times = Input.shadowed(new NumberInput(times));
    }

    // block checking
    times.link(this);

    this.setInput("TIMES", times);

    return this;
  }

  getTimes(): Input {
    return this.getInput("TIMES")!;
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
        throw new Error("Repeat SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }
}
