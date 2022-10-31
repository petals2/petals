import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class WhenStageClicked extends BlockKind.Hat<"event_whenstageclicked"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_whenstageclicked")
      throw new Error(`Expected opcode "event_whenstageclicked", got "${json.opcode}"`);

    return new WhenStageClicked(ID);
  }

  constructor(ID?: string) {
    super("event_whenstageclicked", ID);
  }
}
