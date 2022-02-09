import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node";

export class ThisNode {
  type = <const>"thisNode";

  constructor() { }

  static build(reader: LexReader): ThisNode {
    reader.expect({ type: TokenType.Keyword, value: "this" });

    return new ThisNode();
  }
}
