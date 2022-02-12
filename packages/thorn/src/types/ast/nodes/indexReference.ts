import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/parenthesisexponentialsmultiplicationdivisionadditionsubtraction";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType, validOperators } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";

export class IndexReferenceNode {
  type = <const>"indexReference";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly base: ValueTreeNode,
    protected readonly reference: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getBase() { return this.base }
  getReference() { return this.reference }

  static build(reader: LexReader, base: ValueTreeNode): IndexReferenceNode {
    const idxValue = readValue(reader.readBetween("["));
    return new IndexReferenceNode(new TokenRange(base.getTokenRange().getStart(), idxValue.getTokenRange().getEnd()), base, idxValue);
  }
}
