import { ValueField } from "../../field/value";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class GoForwardBackwardLayers extends BlockKind.Stack<"looks_goforwardbackwardlayers"> {
  constructor(forwardBackward: "forward" | "backward" = "forward", num: Input | number = 1) {
    super("looks_goforwardbackwardlayers");

    this.setForwardBackward(forwardBackward);
    this.setNum(num);
  }

  setForwardBackward(forwardBackward: "forward" | "backward"): this {
    this.setField("FORWARD_BACKWARD", new ValueField(forwardBackward));

    return this;
  }

  getForwardBackward(): "forward" | "backward" {
    const field = this.getField("FORWARD_BACKWARD");

    if (!(field instanceof ValueField)) {
      throw new Error("GoForwardBackwardLayers FORWARD_BACKWARD field is not a value field");
    }

    return field.getValue() as "forward" | "backward";
  }

  setNum(num: Input | number): this {
    if (typeof num === "number") {
      num = Input.shadowed(new NumberInput(num));
    }

    // block checking
    num.link(this);

    this.setInput("NUM", num);

    return this;
  }

  getNum(): Input {
    return this.getInput("NUM")!;
  }
}
