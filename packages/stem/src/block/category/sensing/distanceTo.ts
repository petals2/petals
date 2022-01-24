import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class DistanceTo extends BlockKind.Reporter {
  constructor(object: Input) {
    super("sensing_distanceto");

    this.setObject(object);
  }

  setObject(object: Input): this {
    // block checking
    object.link(this);

    this.setInput("DISTANCETOMENU", object);

    return this;
  }

  getObject(): Input {
    return this.getInput("DISTANCETOMENU")!;
  }
}
