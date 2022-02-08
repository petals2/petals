import { BlockKind } from "../../kinds";

export class MouseX extends BlockKind.Reporter<"sensing_mousex"> {
  constructor() {
    super("sensing_mousex");
  }
}
