import { BlockKind } from "../../kinds";

export class YPosition extends BlockKind.Reporter<"motion_yposition"> {
  constructor() {
    super("motion_yposition");
  }
}
