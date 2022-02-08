import { BlockKind } from "../../kinds";

export class MouseY extends BlockKind.Reporter<"sensing_mouseY"> {
  constructor() {
    super("sensing_mouseY");
  }
}
