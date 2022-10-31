import { NumberInput } from "../../input/number";
import { StringInput } from "../../input/string";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class ThinkForSecs extends BlockKind.Stack<"looks_thinkforsecs"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_thinkforsecs")
      throw new Error(`Expected opcode "looks_thinkforsecs", got "${json.opcode}"`);

    if (json.inputs.MESSAGE == undefined)
      throw new Error("Expected input MESSAGE on ThinkForSecs")

    if (json.inputs.SECS == undefined)
      throw new Error("Expected input SECS on ThinkForSecs")

    const message = Input.fromReference(context, serializedStore, json.inputs.MESSAGE);
    const secs = Input.fromReference(context, serializedStore, json.inputs.SECS);

    return new ThinkForSecs(message, secs, ID);
  }

  constructor(message: Input | string = "Hmm...", secs: Input | number = 2, ID?: string) {
    super("looks_thinkforsecs", ID);

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
