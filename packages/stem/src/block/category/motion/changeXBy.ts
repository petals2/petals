import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class ChangeXBy extends BlockKind.Stack<"motion_changexby"> {
  constructor(dX: number | Input = 10) {
    super("motion_changexby");

    this.setDx(dX);
  }

  setDx(dX: number | Input): this {
    if (typeof dX === "number") {
      dX = Input.shadowed(new NumberInput(dX));
    }

    // block checking
    dX.link(this);

    this.setInput("DX", dX);

    return this;
  }

  getDx(): Input {
    return this.getInput("DX")!;
  }
}
