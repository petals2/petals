import { BlockKind } from "../../kinds";

export class ResetTimer extends BlockKind.Stack<"sensing_resettimer"> {
  constructor() {
    super("sensing_resettimer");
  }
}
