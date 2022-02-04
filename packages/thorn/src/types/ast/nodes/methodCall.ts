import { ValueTreeNode } from "../node";

export class MethodCallNode {
  type = <const>"methodCall";

  constructor(
    protected readonly baseType: ValueTreeNode,
    protected readonly args: ValueTreeNode[],
  ) { }

  getBaseValue() { return this.baseType }
  getArguments() { return this.args }
}
