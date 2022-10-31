import { NumberInput } from "../../input/number";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class Wait extends BlockKind.Stack<"control_wait"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "control_wait")
      throw new Error(`Expected opcode "control_wait", got "${json.opcode}"`);

    if (json.inputs.STOP_OPTION == undefined)
      throw new Error("Expected input STOP_OPTION on Wait");

    const duration = Input.fromReference(context, serializedStore, json.inputs.STOP_OPTION);

    return new Wait(duration, ID)
  }

  constructor(duration: Input | number = 1, ID?: string) {
    super("control_wait");

    this.setDuration(duration);
  }

  setDuration(duration: Input | number): this {
    if (typeof duration === "number") {
      duration = Input.shadowed(new NumberInput(duration))
    }

    // block checking
    duration.link(this);

    this.setInput("DURATION", duration);

    return this;
  }

  getDuration(): Input {
    return this.getInput("DURATION")!;
  }

  isYieldPoint() {
    return true;
  }
}
