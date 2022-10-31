import { Input } from "../../input";
import { Block, SerializedBlock } from "../../block";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class If extends BlockKind.C<"control_if"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_if")
      throw new Error(`Expected opcode "control_if", got "${json.opcode}"`);

    if (json.inputs.CONDITION == undefined) {
      throw new Error("Expected input CONDITION on If");
    }

    if (json.inputs.SUBSTACK == undefined) {
      throw new Error("Expected input SUBSTACK on If");
    }

    const condition = Input.fromReference(context, serializedStore, json.inputs.CONDITION);
    const substack = Input.fromReference(context, serializedStore, json.inputs.SUBSTACK);

    return new If(condition, substack, ID);
  }

  constructor(condition?: Block | Input, substack?: Block | Input, ID?: string) {
    super("control_if", ID);

    if (condition) { this.setCondition(condition) }
    if (substack) { this.setSubstack(substack) }
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
        throw new Error("If CONDITION input is not a block");
      }

      return topLayer;
    }
  }

  setSubstack(substack: Block | Input): this {
    if (substack instanceof Input) {
      const topLayer = substack.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Expected input to be a block");
      }

      substack = topLayer;
    }

    substack.setParent(this);
    this.setInput("SUBSTACK", Input.unshadowed(substack));
    return this;
  }

  getSubstack(): Block | undefined {
    const input = this.getInput("SUBSTACK");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("If SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }
}
