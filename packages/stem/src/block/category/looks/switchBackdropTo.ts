import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class SwitchBackdropTo extends BlockKind.Stack<"looks_switchbackdropto"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_switchbackdropto")
      throw new Error(`Expected opcode "looks_switchbackdropto", got "${json.opcode}"`);

    if (json.inputs.BACKDROP == undefined)
      throw new Error("Expected input BACKDROP on SwitchBackdropTo")

    const backdrop = Input.fromReference(context, serializedStore, json.inputs.BACKDROP);

    return new SwitchBackdropTo(backdrop, ID);
  }

  constructor(backdrop: Input, ID?: string) {
    super("looks_switchbackdropto", ID);

    this.setBackdrop(backdrop);
  }

  setBackdrop(backdrop: Input): this {
    backdrop.link(this);

    this.setInput("BACKDROP", backdrop);

    return this;
  }

  getBackdrop(): Input {
    return this.getInput("BACKDROP")!;
  }
}
