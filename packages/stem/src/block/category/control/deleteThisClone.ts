import { BlockKind } from "../../kinds";

export class DeleteThisClone extends BlockKind.Stack<"control_delete_this_clone"> {
  constructor() {
    super("control_delete_this_clone");
  }
}
