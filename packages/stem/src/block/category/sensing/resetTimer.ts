import { BlockKind } from "../../kinds";

export class ResetTimer extends BlockKind.Stack {
  constructor() {
    super("sensing_resettimer");
  }
}
