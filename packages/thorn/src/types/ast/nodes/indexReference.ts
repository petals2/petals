import { readValue } from "../../../routines/buildAst/readValue";
import { buildPemdas } from "../../../routines/PEMDAS";
import { LexReader } from "../../reader/lexReader";
import { TokenType, validOperators } from "../../token";
import { ValueTreeNode } from "../node";
import { ComparisonOperationNode } from "./comparisonOperation";

export class IndexReferenceNode {
  type = <const>"indexReference";

  constructor(
    protected readonly base: ValueTreeNode,
    protected readonly reference: ValueTreeNode,
  ) { }

  getBase() { return this.base }
  getReference() { return this.reference }

  static build(reader: LexReader, base: ValueTreeNode): IndexReferenceNode {
    return new IndexReferenceNode(base, readValue(reader.readBetween("[")));
  }
}
