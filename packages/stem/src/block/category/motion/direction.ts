import { BlockKind } from "../../kinds";

export class Direction extends BlockKind.Reporter {
  constructor() {
    super("motion_direction");
  }
}
