import { Block } from "../../block";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import { Prototype } from "./prototype";

export class Definition extends BlockKind.Hat<"procedures_definition"> {
  constructor(customBlock: Prototype) {
    super("procedures_definition");

    this.setPrototype(customBlock);
  }

  setPrototype(prototype: Prototype): this {
    prototype.setParent(this);
    this.setInput("custom_block", Input.shadowed(prototype));
    return this;
  }

  getPrototype(): Prototype {
    const input = this.getInput("custom_block");

    if (!input) {
      throw new Error("Definition custom_block input is missing");
    }

    const topLayer = input.getTopLayer();

    if (!(topLayer instanceof Block)) {
      throw new Error("Definition custom_block input is not a block");
    }

    return topLayer as Prototype;
  }
}
