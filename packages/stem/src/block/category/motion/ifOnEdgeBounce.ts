import { BlockKind } from "../../kinds";

export class IfOnEdgeBounce extends BlockKind.Stack<"motion_ifonedgebounce"> {
  constructor() {
    super("motion_ifonedgebounce");
  }
}
