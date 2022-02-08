import { BlockKind } from "../../kinds";

export class WhenStageClicked extends BlockKind.Hat<"event_whenstageclicked"> {
  constructor() {
    super("event_whenstageclicked");
  }
}
