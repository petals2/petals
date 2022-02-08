import { ValueField } from "../../field/value";
import { Input } from "../../input";
import { BlockKind } from "../../kinds";

export enum SensingProperty {
  BackdropNumber = "backdrop #",
  BackdropName = "backdrop name",
  Volume = "volume",
}

export class Of extends BlockKind.Reporter<"sensing_of"> {
  constructor(property: SensingProperty = SensingProperty.BackdropNumber, object: Input) {
    super("sensing_of");

    this.setProperty(property);
    this.setObject(object);
  }

  setProperty(property: SensingProperty): this {
    this.setField("PROPERTY", new ValueField(property));

    return this;
  }

  getProperty(): SensingProperty {
    const field = this.getField("PROPERTY")!;

    if (!(field instanceof ValueField)) {
      throw new Error("Of PROPERTY field is not a value field");
    }

    return field.getValue() as SensingProperty;
  }

  setObject(object: Input): this {
    // block checking
    object.link(this);

    this.setInput("OBJECT", object);

    return this;
  }

  getObject(): Input {
    return this.getInput("OBJECT")!;
  }
}
