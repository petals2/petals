import { Broadcast } from "../../../broadcast";
import { Input } from "../../input";
import { BroadcastInput } from "../../input/broadcast";
import { BlockKind } from "../../kinds";

export class BroadcastAndWait extends BlockKind.Stack<"event_broadcastandwait"> {
  constructor(broadcastInput: Input | Broadcast) {
    super("event_broadcastandwait");

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
