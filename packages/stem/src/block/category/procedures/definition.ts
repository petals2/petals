import { SerializedBlockStore } from "../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { SerializedBlock } from "../../block";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";
import { Prototype } from "./prototype";

export class Definition extends BlockKind.Hat<"procedures_definition"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "procedures_definition")
      throw new Error(`Expected opcode "procedures_definition", got "${json.opcode}"`);

    if (json.inputs.custom_block == undefined)
      throw new Error("Expected input custom_block on Definition")

    const prototypeInput = Input.fromReference(context, serializedStore, json.inputs.custom_block);
    const prototype = prototypeInput.getTopLayer();

    if (!(prototype instanceof Prototype))
      throw new Error("Definition input references non-block or non-prototype block in the top layer of it's custom_block input");

    return new Definition(prototype, ID);
  }

  constructor(customBlock: Prototype, ID?: string) {
    super("procedures_definition", ID);

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

    if (!(topLayer instanceof Prototype)) {
      throw new Error("Definition custom_block input is not a block or not a prototype block");
    }

    return topLayer;
  }
}
