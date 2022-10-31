import { SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BlockKind } from "../../kinds";

export class NextCostume extends BlockKind.Stack<"looks_nextcostume"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_nextcostume")
      throw new Error(`Expected opcode "looks_nextcostume", got "${json.opcode}"`);

    return new NextCostume(ID);
  }

  constructor(ID?: string) {
    super("looks_nextcostume", ID);
  }
}
