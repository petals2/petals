import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";

export class VariableReferenceNode {
  type = <const> "variableReference";

  constructor (
    protected readonly variableName: string,
  ) {}

  getName() { return this.variableName }

  static build(reader: LexReader): VariableReferenceNode {
    return new VariableReferenceNode(reader.expect({ type: TokenType.Identifier }).value);
  }
}
