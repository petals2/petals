import { BlockKind } from "../../kinds";

export class Volume extends BlockKind.Reporter {
  constructor() {
    super("sound_volume");
  }
}
