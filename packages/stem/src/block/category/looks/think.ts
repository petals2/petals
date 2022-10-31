import { StringInput } from "../../input/string";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class Think extends BlockKind.Stack<"looks_think"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_think")
      throw new Error(`Expected opcode "looks_think", got "${json.opcode}"`);

    if (json.inputs.MESSAGE == undefined)
      throw new Error("Expected input MESSAGE on Think")

    const message = Input.fromReference(context, serializedStore, json.inputs.MESSAGE);

    return new Think(message, ID);
  }

  constructor(message: Input | string = "Hmm...", ID?: string) {
    super("looks_think", ID);

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
