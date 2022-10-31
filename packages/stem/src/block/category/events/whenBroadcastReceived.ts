import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { Broadcast } from "../../../broadcast";
import { DeserializationContext } from "../../../project/deserializationContext";
import { BroadcastField } from "../../field/broadcast";
import { BlockKind } from "../../kinds";
import { WhenBackdropSwitchesTo } from "./whenBackdropSwitchesTo";

export class WhenBroadcastReceived extends BlockKind.Hat<"event_whenbroadcastreceived"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_whenbroadcastreceived")
      throw new Error(`Expected opcode "event_whenbroadcastreceived", got "${json.opcode}"`);

    if (json.fields.BROADCAST_OPTION == undefined)
      throw new Error("Expected field BROADCAST_OPTION on WhenBroadcastReceived");

    const id = json.fields.BROADCAST_OPTION[1];

    if (id == undefined) {
      throw new Error("Field format error. Missing ID");
    }

    const broadcast = context.getProject().getTargets().getStage().getBroadcasts().findBroadcastById(id);

    if (broadcast == undefined) {
      throw new Error("Unknown broadcast with id: " + id);
    }

    return new WhenBroadcastReceived(broadcast, ID);
  }

  constructor(broadcastOption: Broadcast, ID?: string) {
    super("event_whenbroadcastreceived", ID);

    this.setBroadcastOption(broadcastOption);
  }

  setBroadcastOption(broadcastOption: Broadcast): this {
    this.setField("BROADCAST_OPTION", new BroadcastField(broadcastOption));

    return this;
  }

  getBroadcastOption(): Broadcast {
    const field = this.getField("BROADCAST_OPTION")!;

    if (!(field instanceof BroadcastField)) {
      throw new Error("WhenBroadcastReceived BROADCAST_OPTION field is not a broadcast field");
    }

    return field.getValue();
  }
}
