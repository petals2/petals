import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";
import { SelfReferenceNode } from "./selfReferenceNode";

export class DecrementOperatorNode {
  type = <const>"decrementOperator";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly node: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getNode() { return this.node }

  static build(reader: LexReader, node: ValueTreeNode): DecrementOperatorNode | ComparisonOperationNode {
    const decrToken = reader.expect({ type: TokenType.Operator, value: "--" });

    if (node instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(node));
    }

    return new DecrementOperatorNode(new TokenRange(node.getTokenRange().getStart(), decrToken), node);
  }
}