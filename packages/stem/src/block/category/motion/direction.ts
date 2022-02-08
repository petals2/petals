import { BlockKind } from "../../kinds";

export class Direction extends BlockKind.Reporter<"motion_direction"> {
  constructor() {
    super("motion_direction");
  }
}
