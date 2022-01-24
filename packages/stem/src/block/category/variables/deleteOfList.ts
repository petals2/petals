import { List } from "../../../list";
import { ListField } from "../../field/list";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { BlockKind } from "../../kinds";

export class DeleteOfList extends BlockKind.Stack {
  constructor(list: List, index: number | Input) {
    super("data_deleteoflist");

    this.setList(list);
    this.setIndex(index);
  }

  setList(list: List): this {
    this.setField("LIST", new ListField(list));
    return this;
  }

  getList(): List {
    const field = this.getField("LIST");

    if (!(field instanceof ListField)) {
      throw new Error("DeleteOfList LIST field is not a list field");
    }

    return field.getValue() as List;
  }

  setIndex(index: number | Input): this {
    if (typeof index === "number") {
      index = Input.shadowed(new NumberInput(index));
    }

    index.link(this);

    this.setInput("INDEX", index);

    return this;
  }

  getIndex(): Input {
    return this.getInput("INDEX")!;
  }
}
