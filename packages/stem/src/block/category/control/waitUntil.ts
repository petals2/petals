import { Input } from "../../input";
import { Block, SerializedBlock } from "../../block";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class WaitUntil extends BlockKind.Stack<"control_wait_until"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_wait_until")
      throw new Error(`Expected opcode "control_wait_until", got "${json.opcode}"`);

    if (json.inputs.CONDITION == undefined)
      throw new Error("Expected input CONDITION on WaitUntil");

    const condition = Input.fromReference(context, serializedStore, json.inputs.CONDITION);

    return new WaitUntil(condition, ID);
  }

  constructor(condition?: Block | Input, ID?: string) {
    super("control_wait_until", ID);

    if (condition) { this.setCondition(condition) }
  }

  setCondition(condition: Block | Input): this {
    if (condition instanceof Input) {
      const topLayer = condition.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Expected input to be a block");
      }

      condition = topLayer;
    }

    condition.setParent(this);
    this.setInput("CONDITION", Input.unshadowed(condition));
    return this;
  }

  getCondition(): Block | undefined {
    const input = this.getInput("CONDITION");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("WaitUntil CONDITION input is not a block");
      }

      return topLayer;
    }
  }

  isYieldPoint() {
    return true;
  }
}
