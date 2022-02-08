import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class ChangeVolumeBy extends BlockKind.Stack<"sound_changevolumeby"> {
  constructor(volume: number | Input = -10) {
    super("sound_changevolumeby");

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
