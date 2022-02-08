import { BlockKind } from "../../kinds";

export class Loudness extends BlockKind.Reporter<"sensing_loudness"> {
  constructor() {
    super("sensing_loudness");
  }
}
