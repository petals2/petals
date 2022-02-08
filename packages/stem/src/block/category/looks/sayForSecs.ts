import { NumberInput } from "../../input/number";
import { StringInput } from "../../input/string";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class SayForSecs extends BlockKind.Stack<"looks_sayforsecs"> {
  constructor(message: Input | string = "Hello!", secs: Input | number = 2) {
    super("looks_sayforsecs");

    this.setMessage(message);
    this.setSecs(secs);
  }

  setMessage(message: Input | string): this {
    if (typeof message === "string") {
      message = Input.shadowed(new StringInput(message));
    }

    // block checking
    message.link(this);

    this.setInput("MESSAGE", message);

    return this;
  }

  getMessage(): Input {
    return this.getInput("MESSAGE")!;
  }

  setSecs(secs: Input | number): this {
    if (typeof secs === "number") {
      secs = Input.shadowed(new NumberInput(secs));
    }

    // block checking
    secs.link(this);

    this.setInput("SECS", secs);

    return this;
  }

  getSecs(): Input {
    return this.getInput("SECS")!;
  }
}
