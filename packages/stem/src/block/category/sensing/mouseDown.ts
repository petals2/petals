import { BlockKind } from "../../kinds";

export class MouseDown extends BlockKind.Boolean<"sensing_mousedown"> {
  constructor() {
    super("sensing_mousedown");
  }
}
