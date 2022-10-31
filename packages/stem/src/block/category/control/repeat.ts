import { NumberInput } from "../../input/number";
import { Input } from "../../input";
import { Block, SerializedBlock } from "../../block";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class Repeat extends BlockKind.C<"control_repeat"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_repeat")
      throw new Error(`Expected opcode "control_repeat", got "${json.opcode}"`);

    if (json.fields.TIMES == undefined)
      throw new Error("Expected field TIMES on Repeat");

    if (json.inputs.SUBSTACK == undefined)
      throw new Error("Expected input SUBSTACK on Repeat");

    const value = Input.fromReference(context, serializedStore, json.inputs.TIMES);

    const substack = Input.fromReference(context, serializedStore, json.inputs.SUBSTACK);

    return new Repeat(value, substack, ID);
  }

  constructor(times: Input | number = 10, substack?: Block | Input, ID?: string) {
    super("control_repeat", ID);

    this.setTimes(times);

    if (substack) { this.setSubstack(substack) }
  }

  setTimes(times: Input | number): this {
    if (typeof times === "number") {
      times = Input.shadowed(new NumberInput(times));
    }

    // block checking
    times.link(this);

    this.setInput("TIMES", times);

    return this;
  }

  getTimes(): Input {
    return this.getInput("TIMES")!;
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
        throw new Error("Repeat SUBSTACK input is not a block");
      }

      return topLayer;
    }
  }
}
