import type { BlockStore, Project, ProjectReference, SerializedBlock, SerializedBlockStore } from "../../..";
import { DeserializationContext } from "../../../project/deserializationContext";
import { ValueField } from "../../field/value";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export enum WhenGreaterThanMenu {
  Loudness = "LOUDNESS",
  Timer = "TIMER"
}

export class WhenGreaterThan extends BlockKind.Hat<"event_whengreaterthan"> {
  static fromReference(context: DeserializationContext, serializedStore: SerializedBlockStore, json: SerializedBlock, ID?: string) {
    if (json.opcode !== "event_whengreaterthan")
      throw new Error(`Expected opcode "event_whengreaterthan", got "${json.opcode}"`);

    if (json.fields.WHENGREATERTHANMENU == undefined)
      throw new Error("Expected field WHENGREATERTHANMENU on WhenGreaterThan");

    if (json.inputs.VALUE == undefined)
      throw new Error("Expected input VALUE on WhenGreaterThan");

    const value = Input.fromReference(context, serializedStore, json.inputs.VALUE);

    return new WhenGreaterThan(json.fields.WHENGREATERTHANMENU[0] as WhenGreaterThanMenu, value, ID);
  }

  constructor(whenGreaterThanMenu: WhenGreaterThanMenu, value: Input | number = 10, ID?: string) {
    super("event_whengreaterthan", ID);

    this.setWhenGreaterThanMenu(whenGreaterThanMenu);
    this.setValue(value);
  }

  setWhenGreaterThanMenu(whenGreaterThanMenu: WhenGreaterThanMenu): this {
    // WTF Scratch Team? Why does this have no underscores?
    this.setField("WHENGREATERTHANMENU", new ValueField(whenGreaterThanMenu));

    return this;
  }

  getWhenGreaterThanMenu(): WhenGreaterThanMenu {
    const field = this.getField("WHENGREATERTHANMENU")!;

    if (!(field instanceof ValueField)) {
      throw new Error("WhenGreaterThan WHENGREATERTHANMENU field is not a value field");
    }

    return field.getValue() as WhenGreaterThanMenu;
  }

  setValue(value: Input | number): this {
    if (typeof value === "number") {
      value = Input.shadowed(new NumberInput(value));
    }

    // block checking
    value.link(this);

    this.setInput("VALUE", value);

    return this;
  }

  getValue(): Input {
    return this.getInput("VALUE")!;
  }
}
