import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class Show extends BlockKind.Stack<"looks_show"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_show")
      throw new Error(`Expected opcode "looks_show", got "${json.opcode}"`);

    return new Show(ID);
  }

  constructor(ID?: string) {
    super("looks_show", ID);
  }
}
