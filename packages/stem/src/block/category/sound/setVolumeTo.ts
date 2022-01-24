import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class SetVolumeTo extends BlockKind.Stack {
  constructor(volume: number | Input = 0) {
    super("sound_setvolumeto");

    this.setVolume(volume);
  }

  setVolume(volume: number | Input): this {
    if (typeof volume === "number") {
      volume = Input.shadowed(new NumberInput(volume));
    }

    // block checking
    volume.link(this);

    this.setInput("VOLUME", volume);

    return this;
  }

  getVolume(): Input {
    return this.getInput("VOLUME")!;
  }
}
