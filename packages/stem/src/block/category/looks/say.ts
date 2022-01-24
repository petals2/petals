import { StringInput } from "../../input/string";
import { AnyInput, Input } from "../../input";
import { BlockKind } from "../../kinds";
import { BlockStore } from "../../store";

export class Say extends BlockKind.Stack {
  constructor(message: Input | string = "Hello!") {
    super("looks_say");

    this.setMessage(message);
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
}
