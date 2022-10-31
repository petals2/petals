import type { BlockStore, SerializedBlockStore } from "../..";
import type { Project, ProjectReference, SerializedBlock } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class DeleteThisClone extends BlockKind.Stack<"control_delete_this_clone"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_delete_this_clone")
      throw new Error(`Expected opcode "control_delete_this_clone", got "${json.opcode}"`);

    return new DeleteThisClone(ID);
  }

  constructor(ID?: string) {
    super("control_delete_this_clone", ID);
  }
}
