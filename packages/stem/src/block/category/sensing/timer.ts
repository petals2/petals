import { BlockKind } from "../../kinds";

export class Timer extends BlockKind.Reporter {
  constructor() {
    super("sensing_timer");
  }
}
