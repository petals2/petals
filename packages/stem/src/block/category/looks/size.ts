import { BlockKind } from "../../kinds";

export class Size extends BlockKind.Reporter<"looks_size"> {
  constructor() {
    super("looks_size");
  }
}
