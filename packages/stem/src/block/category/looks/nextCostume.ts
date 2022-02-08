import { BlockKind } from "../../kinds";

export class NextCostume extends BlockKind.Stack<"looks_nextcostume"> {
  constructor() {
    super("looks_nextcostume");
  }
}
