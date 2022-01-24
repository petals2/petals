import { Input } from "../../input";
import { ColorInput } from "../../input/color";
import { BlockKind } from "../../kinds";

export class ColorIsTouchingColor extends BlockKind.Boolean {
  constructor(color1: ColorInput | Input, color2: ColorInput | Input) {
    super("sensing_coloristouchingcolor");

    this.setColor1(color1);
    this.setColor2(color2);
  }

  setColor1(color1: ColorInput | Input): this {
    if (color1 instanceof ColorInput) {
      color1 = Input.shadowed(color1);
    }

    // block checking
    color1.link(this);

    this.setInput("COLOR", color1);

    return this;
  }

  getColor1(): ColorInput {
    const input = this.getInput("COLOR")!;

    if (!(input instanceof ColorInput)) {
      throw new Error("ColorIsTouchingColor COLOR field is not a color input");
    }

    return input;
  }

  setColor2(color2: ColorInput | Input): this {
    if (color2 instanceof ColorInput) {
      color2 = Input.shadowed(color2);
    }

    // block checking
    color2.link(this);

    this.setInput("COLOR2", color2);

    return this;
  }

  getColor2(): ColorInput {
    const input = this.getInput("COLOR2")!;

    if (!(input instanceof ColorInput)) {
      throw new Error("ColorIsTouchingColor COLOR2 field is not a color input");
    }

    return input;
  }
}
