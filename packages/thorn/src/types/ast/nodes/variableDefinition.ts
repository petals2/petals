import { readValue } from "../../../routines/buildAst/readValue";
import { getType } from "../../../routines/translateThroughPetals/getType";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node"
import { Type } from "../type";

export class VariableDefinitionNode {
  type = <const> "variableDefinition";

  constructor (
    protected readonly variableName: string,
    protected readonly variableType?: Type,
    protected readonly initialValue?: ValueTreeNode,
  ) {}

  getName() { return this.variableName }
  getType() { return this.variableType }
  getInitialValue() { return this.initialValue }

  static build(reader: LexReader): VariableDefinitionNode {
    reader.expect({ type: TokenType.Keyword, value: "var" });

    const name = reader.expect({ type: TokenType.Identifier });

    let type: Type | undefined;

    if (reader.nextIs({ type: TokenType.Separator, value: ":" })) {
      reader.expect({ type: TokenType.Separator, value: ":" });

      type = Type.build(reader);
    }

    if (reader.nextIs({ type: TokenType.Separator, value: "="})) {
      reader.expect({ type: TokenType.Separator, value: "=" });
  
      const value = readValue(reader);
  
      if (reader.nextIs({ type: TokenType.Separator, value: ";" })) reader.read();
  
      return new VariableDefinitionNode(name.value, type, value);
    }

    return new VariableDefinitionNode(name.value, type);
  }
}
