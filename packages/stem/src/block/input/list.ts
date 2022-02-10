import { List } from "../../list/list";

export type SerializedListInput = [13, string, string];

export class ListInput {
  constructor(protected val: List) { }

  serialize(): SerializedListInput { return [13, this.val.getName(), this.val.getId()] }

  getValue(): List { return this.val }
}
