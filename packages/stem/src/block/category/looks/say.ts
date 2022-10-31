import { StringInput } from "../../input/string";
import { AnyInput, Input } from "../../input";
import { BlockKind } from "../../kinds";
import { BlockStore, SerializedBlockStore } from "../../store";
import { DeserializationContext } from "../../../project/deserializationContext";
import { SerializedBlock } from "../../..";

export class Say extends BlockKind.Stack<"looks_say"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_say")
      throw new Error(`Expected opcode "looks_say", got "${json.opcode}"`);

    if (json.inputs.MESSAGE == undefined)
      throw new Error("Expected input MESSAGE on Say")

    const message = Input.fromReference(context, serializedStore, json.inputs.MESSAGE);

    return new Say(message, ID);
  }

  constructor(message: Input | string = "Hello!", ID?: string) {
    super("looks_say", ID);

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
