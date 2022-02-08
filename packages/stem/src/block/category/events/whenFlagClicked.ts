import { BlockKind } from "../../kinds";

export class WhenFlagClicked extends BlockKind.Hat<"event_whenflagclicked"> {
  constructor() {
    super("event_whenflagclicked");
  }
}
