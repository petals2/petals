import { List } from "../../../list/list";
import { ListField } from "../../field/list";
import { Input } from "../../input";
import { StringInput } from "../../input/string";
import { BlockKind } from "../../kinds";

export class ItemNumOfList extends BlockKind.Reporter<"data_itemnumoflist"> {
  constructor(list: List, item: string | Input) {
    super("data_itemnumoflist");

    this.setList(list);
    this.setItem(item);
  }

  setList(list: List): this {
    this.setField("LIST", new ListField(list));
    return this;
  }

  getList(): List {
    const field = this.getField("LIST");

    if (!(field instanceof ListField)) {
      throw new Error("ItemNumOfList LIST field is not a list field");
    }

    return field.getValue() as List;
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
