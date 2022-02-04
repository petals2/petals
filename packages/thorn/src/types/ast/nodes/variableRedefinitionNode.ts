import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node"

export class VariableRedefinitionNode {
  type = <const>"variableRedefinition";

  constructor(
    protected readonly base: ValueTreeNode,
    protected readonly newValue: ValueTreeNode,
  ) { }

  getBase() { return this.base }
  getNewValue() { return this.newValue }

  static build(reader: LexReader, base: ValueTreeNode): VariableRedefinitionNode {
    reader.expect({ type: TokenType.Separator, value: "=" });

    const value = readValue(reader);

    if (reader.nextIs({ type: TokenType.Separator, value: ";" })) reader.read();

    return new VariableRedefinitionNode(base, value);
  }
}
