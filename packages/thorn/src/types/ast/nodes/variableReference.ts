import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";

export class VariableReferenceNode {
  type = <const> "variableReference";

  constructor (
    protected readonly tokenRange: TokenRange,
    protected readonly variableName: string,
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  getName() { return this.variableName }

  static build(reader: LexReader): VariableReferenceNode {
    const token = reader.expect({ type: TokenType.Identifier });
    return new VariableReferenceNode(new TokenRange(token), token.value);
  }
}