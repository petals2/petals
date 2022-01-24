import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class GotoXy extends BlockKind.Stack {
  constructor(x: number | Input = 0, y: number | Input = 0) {
    super("motion_gotoxy");

    this.setX(x);
    this.setY(y);
  }

  setX(x: number | Input): this {
    if (typeof x === "number") {
      x = Input.shadowed(new NumberInput(x));
    }

    // block checking
    x.link(this);

    this.setInput("X", x);

    return this;
  }

  getX(): Input {
    return this.getInput("X")!;
  }

  setY(y: number | Input): this {
    if (typeof y === "number") {
      y = Input.shadowed(new NumberInput(y));
    }

    // block checking
    y.link(this);

    this.setInput("Y", y);

    return this;
  }

  getY(): Input {
    return this.getInput("Y")!;
  }
}
