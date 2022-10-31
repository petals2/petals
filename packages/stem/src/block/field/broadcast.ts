import { Broadcast } from "../../broadcast";

export class BroadcastField {
  constructor(private readonly broadcast: Broadcast) {}

  serialize() { return <const> [this.broadcast.getName(), this.broadcast.getId()] }

  getValue(): Broadcast { return this.broadcast }
}
