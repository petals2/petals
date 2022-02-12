import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";

export class ThisNode {
  type = <const>"thisNode";

  constructor(
    protected readonly tokenRange: TokenRange
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  static build(reader: LexReader): ThisNode {
    const thisToken = reader.expect({ type: TokenType.Keyword, value: "this" });

    return new ThisNode(new TokenRange(thisToken));
  }
}
