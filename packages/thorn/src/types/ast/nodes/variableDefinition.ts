import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { getType } from "../../../routines/translateThroughPetals/getType";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node"
import { Type } from "../type";
import { SelfReferenceNode } from "./selfReferenceNode";

export class VariableDefinitionNode {
  type = <const> "variableDefinition";

  constructor (
    protected readonly tokenRange: TokenRange,
    protected readonly variableName: string,
    protected readonly variableType?: Type,
    protected readonly initialValue?: ValueTreeNode,
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  getName() { return this.variableName }
  getType() { return this.variableType }
  getInitialValue() { return this.initialValue }

  static build(reader: LexReader): VariableDefinitionNode {
    const varToken = reader.expect({ type: TokenType.Keyword, value: "var" });

    const nameToken = reader.expect({ type: TokenType.Identifier });

    let type: Type | undefined;

    if (reader.nextIs({ type: TokenType.Separator, value: ":" })) {
      reader.expect({ type: TokenType.Separator, value: ":" });

      type = Type.build(reader);
    }

    if (reader.nextIs({ type: TokenType.Separator, value: "="})) {
      reader.expect({ type: TokenType.Separator, value: "=" });
  
      const value = readValue(reader);
      
      if (value instanceof SelfReferenceNode) {
        reader.pushLexError(new SelfPassedAsValueError(value));
      }
  
      if (reader.nextIs({ type: TokenType.Separator, value: ";" })) reader.read();
  
      return new VariableDefinitionNode(new TokenRange(varToken, value.getTokenRange().getEnd()), nameToken.value, type, value);
    }

    return new VariableDefinitionNode(new TokenRange(varToken, nameToken), nameToken.value, type);
  }
}
