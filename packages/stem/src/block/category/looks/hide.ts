import { SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class Hide extends BlockKind.Stack<"looks_hide"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_hide")
      throw new Error(`Expected opcode "looks_hide", got "${json.opcode}"`);

    return new Hide(ID);
  }

  constructor(ID?: string) {
    super("looks_hide", ID);
  }
}
