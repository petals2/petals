import { NumberInput } from "../../input/number";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class SetSizeTo extends BlockKind.Stack<"looks_setsizeto"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_setsizeto")
      throw new Error(`Expected opcode "looks_setsizeto", got "${json.opcode}"`);

    if (json.inputs.SIZE == undefined)
      throw new Error("Expected input SIZE on SetSizeTo")

    const value = Input.fromReference(context, serializedStore, json.inputs.SIZE);

    return new SetSizeTo(value, ID);
  }

  constructor(size: Input | number = 100, ID?: string) {
    super("looks_setsizeto", ID);

    this.setSize(size);
  }

  setSize(size: Input | number): this {
    if (typeof size === "number") {
      size = Input.shadowed(new NumberInput(size));
    }

    // block checking
    size.link(this);

    this.setInput("SIZE", size);

    return this;
  }

  getSize(): Input {
    return this.getInput("SIZE")!;
  }
}
