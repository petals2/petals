import { Input } from "../../input";
import { Block, SerializedBlock } from "../../block";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class IfElse extends BlockKind.E<"control_if_else"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_if_else")
      throw new Error(`Expected opcode "control_if_else", got "${json.opcode}"`);

    if (json.inputs.CONDITION == undefined) {
      throw new Error("Expected input CONDITION on IfElse");
    }

    if (json.inputs.SUBSTACK == undefined) {
      throw new Error("Expected input SUBSTACK on IfElse");
    }

    if (json.inputs.SUBSTACK2 == undefined) {
      throw new Error("Expected input SUBSTACK2 on IfElse");
    }

    const condition = Input.fromReference(context, serializedStore, json.inputs.CONDITION);
    const substack = Input.fromReference(context, serializedStore, json.inputs.SUBSTACK);
    const substack2 = Input.fromReference(context, serializedStore, json.inputs.SUBSTACK2);

    return new IfElse(condition, substack, substack2, ID);
  }

  constructor(condition?: Block | Input, substackTrue?: Block | Input, substackFalse?: Block | Input, ID?: string) {
    super("control_if_else", ID);

    if (condition) { this.setCondition(condition) }
    if (substackTrue) { this.setSubstackTrue(substackTrue) }
    if (substackFalse) { this.setSubstackFalse(substackFalse) }
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
        throw new Error("IfElse CONDITION input is not a block");
      }

      return topLayer;
    }
  }

  setSubstackTrue(substackTrue: Block | Input): this {
    if (substackTrue instanceof Input) {
      const topLayer = substackTrue.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Expected input to be a block");
      }

      substackTrue = topLayer;
    }

    substackTrue.setParent(this);
    this.setInput("SUBSTACK", Input.unshadowed(substackTrue));
    return this;
  }

  getSubstackTrue(): Block | undefined {
    const input = this.getInput("SUBSTACK");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("IfElse SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }

  setSubstackFalse(substackFalse: Block | Input): this {
    if (substackFalse instanceof Input) {
      const topLayer = substackFalse.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("Expected input to be a block");
      }

      substackFalse = topLayer;
    }

    substackFalse.setParent(this);
    this.setInput("SUBSTACK2", Input.unshadowed(substackFalse));
    return this;
  }

  getSubstackFalse(): Block | undefined {
    const input = this.getInput("SUBSTACK2");

    if (input) {
      const topLayer = input.getTopLayer();

      if (!(topLayer instanceof Block)) {
        throw new Error("IfElse SUBSTACK2 input is not a block");
      }

      return topLayer;
    }
  }
}
