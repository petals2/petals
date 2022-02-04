import { LexReader } from "../../reader/lexReader";
import { ReturnSiloType, SILO } from "petals-silo";
import { TokenType } from "../../token";
import { ValueTreeNode } from "../node";
import { readValue } from "../../../routines/buildAst/readValue";

export class StructLiteralNode {
  type = <const>"structLiteral";

  constructor(
    protected readonly name: string,
    protected readonly value: Record<string, ValueTreeNode>,
  ) { }

  getName() { return this.name }
  getValue() { return this.value }

  static build(reader: LexReader): StructLiteralNode {
    const name = reader.expect({ type: TokenType.Identifier }).value;

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

      if (contents.nextIs({ type: TokenType.Separator, value: "," }, { type: TokenType.Separator, value: ";" })) contents.read();

      valueStore[name] = value;
    }

    return new StructLiteralNode(
      name,
      valueStore,
    );
  }
}
