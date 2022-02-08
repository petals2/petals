import { BlockKind } from "../../kinds";

export class Hide extends BlockKind.Stack<"looks_hide"> {
  constructor() {
    super("looks_hide");
  }
}
