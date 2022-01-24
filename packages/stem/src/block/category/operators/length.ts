import { Input } from "../../input";
import { StringInput } from "../../input/string";
import { BlockKind } from "../../kinds";

export class Length extends BlockKind.Reporter {
  constructor(string: string | Input = "apple") {
    super("operator_length");

    this.setString(string);
  }

  setString(string: string | Input): this {
    if (typeof string === "string") {
      string = Input.shadowed(new StringInput(string));
    }

    // block checking
    string.link(this);

    this.setInput("STRING", string);

    return this;
  }

  getString(): Input {
    return this.getInput("STRING")!;
  }
}
