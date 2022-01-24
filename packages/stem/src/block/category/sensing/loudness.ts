import { BlockKind } from "../../kinds";

export class Loudness extends BlockKind.Reporter {
  constructor() {
    super("sensing_loudness");
  }
}
