import { Input } from "../../input";
import { StringInput } from "../../input/string";
import { BlockKind } from "../../kinds";

export class KeyPressed extends BlockKind.Boolean<"sensing_keypressed"> {
  constructor(keyOption: Input) {
    super("sensing_keypressed");

    this.setKeyOption(keyOption);
  }

  setKeyOption(keyOption: Input): this {
    if (typeof keyOption === "string") {
      keyOption = Input.shadowed(new StringInput(keyOption));
    }

    // block checking
    keyOption.link(this);

    this.setInput("KEY_OPTION", keyOption);

    return this;
  }

  getKeyOption(): Input {
    return this.getInput("KEY_OPTION")!;
  }
}
