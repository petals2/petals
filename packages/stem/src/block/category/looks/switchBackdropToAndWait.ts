import { SerializedBlockStore, SerializedBlock } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class SwitchBackdropToAndWait extends BlockKind.Stack<"looks_switchbackdroptoandwait"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "looks_switchbackdroptoandwait")
      throw new Error(`Expected opcode "looks_switchbackdroptoandwait", got "${json.opcode}"`);

    if (json.inputs.BACKDROP == undefined)
      throw new Error("Expected input BACKDROP on SwitchBackdropToAndWait")

    const backdrop = Input.fromReference(context, serializedStore, json.inputs.BACKDROP);

    return new SwitchBackdropToAndWait(backdrop, ID);
  }

  constructor(backdrop: Input, ID?: string) {
    super("looks_switchbackdroptoandwait", ID);

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

  isYieldPoint() {
    return true;
  }
}
