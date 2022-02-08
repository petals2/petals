import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { StringInput } from "../../input/string";
import { BlockKind } from "../../kinds";

export class LetterOf extends BlockKind.Reporter<"operator_letter_of"> {
  constructor(letter: number | Input = 1, string: string | Input = "apple") {
    super("operator_letter_of");

    this.setLetter(letter);
    this.setString(string);
  }

  setLetter(letter: number | Input): this {
    if (typeof letter === "number") {
      letter = Input.shadowed(new NumberInput(letter));
    }

    // block checking
    letter.link(this);

    this.setInput("LETTER", letter);

    return this;
  }

  getLetter(): Input {
    return this.getInput("LETTER")!;
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
