import { SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class ClearGraphicEffects extends BlockKind.Stack<"looks_cleargraphiceffects"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_cleargraphiceffects")
      throw new Error(`Expected opcode "looks_cleargraphiceffects", got "${json.opcode}"`);

    return new ClearGraphicEffects(ID);
  }

  constructor(ID?: string) {
    super("looks_cleargraphiceffects", ID);
  }
}
