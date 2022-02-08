import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export class TouchingObject extends BlockKind.Stack<"sensing_touchingobject"> {
  constructor(object: Input) {
    super("sensing_touchingobject");

    this.setObject(object);
  }

  setObject(object: Input): this {
    // block checking
    object.link(this);

    this.setInput("TOUCHINGOBJECTMENU", object);

    return this;
  }

  getObject(): Input {
    return this.getInput("TOUCHINGOBJECTMENU")!;
  }
}
