import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class Play extends BlockKind.Stack {
  constructor(sound: Input) {
    super("sound_play");

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
