import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class Random extends BlockKind.Reporter<"operator_random"> {
  constructor(from: number | Input = 0, to: number | Input = 0) {
    super("operator_random");

    this.setFrom(from);
    this.setTo(to);
  }

  setFrom(from: number | Input): this {
    if (typeof from === "number") {
      from = Input.shadowed(new NumberInput(from));
    }

    // block checking
    from.link(this);

    this.setInput("FROM", from);

    return this;
  }

  getFrom(): Input {
    return this.getInput("FROM")!;
  }

  setTo(to: number | Input): this {
    if (typeof to === "number") {
      to = Input.shadowed(new NumberInput(to));
    }

    // block checking
    to.link(this);

    this.setInput("TO", to);

    return this;
  }

  getTo(): Input {
    return this.getInput("TO")!;
  }
}
