import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node";

export class ReturnNode {
  type = <const>"return";

  constructor(
    protected readonly value: ValueTreeNode,
  ) { }

  getValue() { return this.value }

  static build(reader: LexReader): ReturnNode {
    reader.expect({ type: TokenType.Keyword, value: "return" });

    return new ReturnNode(readValue(reader));
  }
}
