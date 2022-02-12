import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class StructLiteralNode {
  type = <const>"structLiteral";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly name: string,
    protected readonly value: Record<string, ValueTreeNode>,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getName() { return this.name }
  getValue() { return this.value }

  static build(reader: LexReader): StructLiteralNode {
    const nameToken = reader.expect({ type: TokenType.Identifier });

    const contents = reader.readBetween("{");

    let valueStore: Record<string, ValueTreeNode> = {};

    while (!contents.isComplete()) {
      const name = contents.expect(
        { type: TokenType.Identifier },
        { type: TokenType.StringLiteral },
        { type: TokenType.NumberLiteral },
        { type: TokenType.BooleanLiteral },
      ).value.toString();

      contents.expect({ type: TokenType.Separator, value: ":" });

      const value = readValue(contents);
      
      if (value instanceof SelfReferenceNode) {
        reader.pushLexError(new SelfPassedAsValueError(value));
      }

      if (contents.nextIs({ type: TokenType.Separator, value: "," }, { type: TokenType.Separator, value: ";" })) contents.read();

      valueStore[name] = value;
    }

    return new StructLiteralNode(
      new TokenRange(nameToken, contents.getRange().getEnd()),
      nameToken.value,
      valueStore,
    );
  }
}