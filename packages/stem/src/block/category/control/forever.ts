import { Input } from "../../input";
import { Block, SerializedBlock } from "../../block";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class Forever extends BlockKind.C<"control_forever"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_forever")
      throw new Error(`Expected opcode "control_forever", got "${json.opcode}"`);

    if (json.inputs.SUBSTACK == undefined) {
      throw new Error("Expected input SUBSTACK on Forever");
    }

    const substack = Input.fromReference(context, serializedStore, json.inputs.SUBSTACK);

    return new Forever(substack, ID);
  }

  constructor(substack?: Block | Input, ID?: string) {
    super("control_forever", ID);

    if (substack) { this.setSubstack(substack) }
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
        throw new Error("Forever SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }
}
