import { BlockKind } from "../../kinds";

export class StopAllSounds extends BlockKind.Stack<"sound_stopallsounds"> {
  constructor() {
    super("sound_stopallsounds");
  }
}
