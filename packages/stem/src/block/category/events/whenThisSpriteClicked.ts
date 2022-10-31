import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class WhenThisSpriteClicked extends BlockKind.Hat<"event_whenthisspriteclicked"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_whenthisspriteclicked")
      throw new Error(`Expected opcode "event_whenthisspriteclicked", got "${json.opcode}"`);

    return new WhenThisSpriteClicked(ID);
  }

  constructor(ID?: string) {
    super("event_whenthisspriteclicked", ID);
  }
}
