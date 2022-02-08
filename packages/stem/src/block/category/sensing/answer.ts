import { BlockKind } from "../../kinds";

export class Answer extends BlockKind.Reporter<"sensing_answer"> {
  constructor() {
    super("sensing_answer");
  }
}
