import { Broadcast } from "../../broadcast";

export type SerializedBroadcastInput = [11, string, string];

export class BroadcastInput {
  constructor(protected val: Broadcast) { }

  serialize(): SerializedBroadcastInput { return [11, this.val.getName(), this.val.getId()] }

  getValue(): Broadcast { return this.val }
}
