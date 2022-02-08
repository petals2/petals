import { BlockKind } from "../../kinds";

export class XPosition extends BlockKind.Reporter<"motion_xposition"> {
  constructor() {
    super("motion_xposition");
  }
}
