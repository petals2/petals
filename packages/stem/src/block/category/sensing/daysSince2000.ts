import { BlockKind } from "../../kinds";

export class DaysSince2000 extends BlockKind.Reporter<"sensing_dayssince2000"> {
  constructor() {
    super("sensing_dayssince2000");
  }
}
