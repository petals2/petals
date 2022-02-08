import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class PlayUntilDone extends BlockKind.Stack<"sound_playuntildone"> {
  constructor(sound: Input) {
    super("sound_playuntildone");

    this.setSound(sound);
  }

  setSound(sound: Input): this {
    sound.link(this);

    this.setInput("SOUND", sound);

    return this;
  }

  getSound(): Input {
    return this.getInput("SOUND")!;
  }
}
