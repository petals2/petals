import { Broadcast } from "../../../broadcast";
import { BroadcastField } from "../../field/broadcast";
import { BlockKind } from "../../kinds";

export class WhenBroadcastReceived extends BlockKind.Hat<"event_whenbroadcastreceived"> {
  constructor(broadcastOption: Broadcast) {
    super("event_whenbroadcastreceived");

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
