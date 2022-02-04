import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node";

export class FreeNode {
  type = <const>"free";

  constructor(
    protected readonly value: ValueTreeNode,
  ) { }

  getValue() { return this.value }

  static build(reader: LexReader): FreeNode {
    reader.expect({ type: TokenType.Keyword, value: "free" });

    return new FreeNode(readValue(reader));
  }
}
