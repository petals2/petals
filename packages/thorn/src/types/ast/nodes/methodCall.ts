import { TokenRange } from "../../token";
import { ValueTreeNode } from "../node";

export class MethodCallNode {
  type = <const>"methodCall";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly baseType: ValueTreeNode,
    protected readonly args: ValueTreeNode[],
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getBaseValue() { return this.baseType }
  getArguments() { return this.args }
}