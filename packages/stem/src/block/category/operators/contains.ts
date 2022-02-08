import { Input } from "../../input";
import { StringInput } from "../../input/string";
import { BlockKind } from "../../kinds";

export class Contains extends BlockKind.Boolean<"operator_contains"> {
  constructor(string1: string | Input = "apple ", string2: string | Input = "banana") {
    super("operator_contains");

    this.setString1(string1);
    this.setString2(string2);
  }

  setString1(string1: string | Input): this {
    if (typeof string1 === "string") {
      string1 = Input.shadowed(new StringInput(string1));
    }

    // block checking
    string1.link(this);

    this.setInput("STRING1", string1);

    return this;
  }

  getString1(): Input {
    return this.getInput("STRING1")!;
  }

  setString2(string2: string | Input): this {
    if (typeof string2 === "string") {
      string2 = Input.shadowed(new StringInput(string2));
    }

    // block checking
    string2.link(this);

    this.setInput("STRING2", string2);

    return this;
  }

  getString2(): Input {
    return this.getInput("STRING2")!;
  }
}
