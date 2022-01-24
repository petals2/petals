import { BlockKind } from "../../kinds";

export class Answer extends BlockKind.Reporter {
  constructor() {
    super("sensing_answer");
  }
}
