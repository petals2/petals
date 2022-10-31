import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class Size extends BlockKind.Reporter<"looks_size"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_size")
      throw new Error(`Expected opcode "looks_size", got "${json.opcode}"`);

    return new Size(ID);
  }

  constructor(ID?: string) {
    super("looks_size", ID);
  }
}
