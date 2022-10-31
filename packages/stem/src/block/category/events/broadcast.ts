import { Input } from "../../input";
import { Broadcast as BroadcastType } from "../../../broadcast";
import { BroadcastInput } from "../../input/broadcast";
import { BlockKind } from "../../kinds";
import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";

export class Broadcast extends BlockKind.Stack<"event_broadcast"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_broadcast")
      throw new Error(`Expected opcode "event_broadcast", got "${json.opcode}"`);

    if (json.inputs.BROADCAST_INPUT == undefined)
      throw new Error("Expected input BROADCAST_INPUT on Broadcast");

    const broadcast = Input.fromReference(context, serializedStore, json.inputs.BROADCAST_INPUT);

    return new Broadcast(broadcast, ID);
  }

  constructor(broadcastInput: Input | BroadcastType, ID?: string) {
    super("event_broadcast", ID);

    this.setBroadcastInput(broadcastInput);
  }

  setBroadcastInput(broadcastInput: Input | BroadcastType): this {
    if (broadcastInput instanceof BroadcastType) {
      broadcastInput = Input.shadowed(new BroadcastInput(broadcastInput));
    }

    broadcastInput.link(this);

    this.setInput("BROADCAST_INPUT", broadcastInput);

    return this;
  }

  getBroadcastInput(): Input {
    return this.getInput("BROADCAST_INPUT")!;
  }
}
