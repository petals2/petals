import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType, validOperators } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";
import { SelfReferenceNode } from "./selfReferenceNode";

export class NegateOperator {
  type = <const>"negateOperator";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly node: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getNode() { return this.node }

  static build(reader: LexReader): NegateOperator | ComparisonOperationNode {
    const negateToken = reader.expect({ type: TokenType.Operator, value: "!" });
    
    const value = readValue(reader);
    
    if (value instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(value));
    }

    return new NegateOperator(new TokenRange(negateToken, value.getTokenRange().getEnd()), value);
  }
}
