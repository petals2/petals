import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { LexReader } from "../../reader/lexReader";
import { TokenType, validOperators } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";

export class NegateOperator {
  type = <const>"negateOperator";

  constructor(
    protected readonly node: ValueTreeNode,
  ) { }

  getNode() { return this.node }

  static build(reader: LexReader): NegateOperator | ComparisonOperationNode {
    reader.expect({ type: TokenType.Operator, value: "!" });

    return new NegateOperator(readValue(reader));
  }
}
