import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { Broadcast } from "../../../broadcast";
import { DeserializationContext } from "../../../project/deserializationContext";
import { Input } from "../../input";
import { BroadcastInput } from "../../input/broadcast";
import { BlockKind } from "../../kinds";

export class BroadcastAndWait extends BlockKind.Stack<"event_broadcastandwait"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_broadcastandwait")
      throw new Error(`Expected opcode "event_broadcastandwait", got "${json.opcode}"`);

    if (json.inputs.BROADCAST_INPUT == undefined)
      throw new Error("Expected input BROADCAST_INPUT on BroadcastAndWait");

    const broadcast = Input.fromReference(context, serializedStore, json.inputs.BROADCAST_INPUT);

    return new BroadcastAndWait(broadcast, ID);
  }

  constructor(broadcastInput: Input | Broadcast, ID?: string) {
    super("event_broadcastandwait", ID);

    this.setBroadcastInput(broadcastInput);
  }

  setBroadcastInput(broadcastInput: Input | Broadcast): this {
    if (broadcastInput instanceof Broadcast) {
      broadcastInput = Input.shadowed(new BroadcastInput(broadcastInput));
    }

    broadcastInput.link(this);

    this.setInput("BROADCAST_INPUT", broadcastInput);

    return this;
  }

  getBroadcastInput(): Input {
    return this.getInput("BROADCAST_INPUT")!;
  }

  isYieldPoint() {
    return true;
  }
}
