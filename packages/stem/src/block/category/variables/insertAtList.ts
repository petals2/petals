import { List } from "../../../list/list";
import { ListField } from "../../field/list";
import { Input } from "../../input";
import { NumberInput } from "../../input/number";
import { StringInput } from "../../input/string";
import { BlockKind } from "../../kinds";

export class InsertAtList extends BlockKind.Stack<"data_insertatlist"> {
  constructor(list: List, index: number | Input, item: string | Input) {
    super("data_insertatlist");

    this.setList(list);
    this.setIndex(index);
    this.setItem(item);
  }

  setList(list: List): this {
    this.setField("LIST", new ListField(list));
    return this;
  }

  getList(): List {
    const field = this.getField("LIST");

    if (!(field instanceof ListField)) {
      throw new Error("ReplaceItemOfList LIST field is not a list field");
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

  setItem(item: string | Input): this {
    if (typeof item === "string") {
      item = Input.shadowed(new StringInput(item));
    }

    item.link(this);

    this.setInput("ITEM", item);

    return this;
  }

  getItem(): Input {
    return this.getInput("ITEM")!;
  }
}
