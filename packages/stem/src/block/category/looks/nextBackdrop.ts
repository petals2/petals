import { SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class NextBackdrop extends BlockKind.Stack<"looks_nextbackdrop"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_nextbackdrop")
      throw new Error(`Expected opcode "looks_nextbackdrop", got "${json.opcode}"`);

    return new NextBackdrop(ID);
  }

  constructor(ID?: string) {
    super("looks_nextbackdrop", ID);
  }
}
