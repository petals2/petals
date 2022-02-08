import { BlockKind } from "../../kinds";

export class Volume extends BlockKind.Reporter<"sound_volume"> {
  constructor() {
    super("sound_volume");
  }
}
