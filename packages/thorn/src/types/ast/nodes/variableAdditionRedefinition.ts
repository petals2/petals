import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class VariableAdditionRedefinitionNode {
  type = <const>"variableRedefinition";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly base: ValueTreeNode,
    protected readonly newValue: ValueTreeNode,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getBase() { return this.base }
  getNewValue() { return this.newValue }

  static build(reader: LexReader, base: ValueTreeNode): VariableAdditionRedefinitionNode {
    reader.expect({ type: TokenType.Separator, value: "+=" });

    const value = readValue(reader);

    if (value instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(value));
    }

    if (reader.nextIs({ type: TokenType.Separator, value: ";" })) reader.read();

    return new VariableAdditionRedefinitionNode(new TokenRange(base.getTokenRange().getStart(), value.getTokenRange().getEnd()), base, value);
  }
}