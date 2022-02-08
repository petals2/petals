import { BlockKind } from "../../kinds";

export class Username extends BlockKind.Reporter<"sensing_username"> {
  constructor() {
    super("sensing_username");
  }
}
