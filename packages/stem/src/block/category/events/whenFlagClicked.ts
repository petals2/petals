import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class WhenFlagClicked extends BlockKind.Hat<"event_whenflagclicked"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_whenflagclicked")
      throw new Error(`Expected opcode "event_whenflagclicked", got "${json.opcode}"`);

    return new WhenFlagClicked(ID);
  }

  constructor(ID?: string) {
    super("event_whenflagclicked", ID);
  }
}
