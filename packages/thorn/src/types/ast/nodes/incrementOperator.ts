import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/parenthesisexponentialsmultiplicationdivisionadditionsubtraction";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType, validOperators } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";
import { SelfReferenceNode } from "./selfReferenceNode";

export class IncrementOperatorNode {
  type = <const>"incrementOperator";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly node: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getNode() { return this.node }

  static build(reader: LexReader, node: ValueTreeNode): IncrementOperatorNode | ComparisonOperationNode {
    const incrToken = reader.expect({ type: TokenType.Operator, value: "++" });
    
    if (node instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(node));
    }

    return new IncrementOperatorNode(new TokenRange(node.getTokenRange().getStart(), incrToken), node);
  }
}
