import { BlockKind } from "../../kinds";

export class MouseDown extends BlockKind.Boolean {
  constructor() {
    super("sensing_mousedown");
  }
}
