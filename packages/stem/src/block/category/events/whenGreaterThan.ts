import { ValueField } from "../../field/value";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export enum WhenGreaterThanMenu {
  Loudness = "LOUDNESS",
  Timer = "TIMER"
}

export class WhenGreaterThan extends BlockKind.Hat<"event_whengreaterthan"> {
  constructor(whenGreaterThanMenu: WhenGreaterThanMenu, value: Input | number = 10) {
    super("event_whengreaterthan");

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
