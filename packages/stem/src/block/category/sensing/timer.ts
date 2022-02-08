import { BlockKind } from "../../kinds";

export class Timer extends BlockKind.Reporter<"sensing_timer"> {
  constructor() {
    super("sensing_timer");
  }
}
