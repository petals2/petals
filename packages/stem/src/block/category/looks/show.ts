import { BlockKind } from "../../kinds";

export class Show extends BlockKind.Stack<"looks_show"> {
  constructor() {
    super("looks_show");
  }
}
