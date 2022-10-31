import { Type } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class ArrayType extends Type {
  constructor(
    range: TokenRange,
    protected readonly base: Type,
    protected readonly length?: number,
  ) { super(range) }

  static build(base: Type, reader: LexReader): ArrayType {
    reader.openRange();

    let length: number | undefined = undefined;

    reader.expect({ type: TokenType.Separator, value: "[" });

    if (reader.nextIs({ type: TokenType.NumberLiteral })) {
      length = reader.expect({ type: TokenType.NumberLiteral }).value;
    }

    reader.expect({ type: TokenType.Separator, value: "]" });

    return new ArrayType(reader.closeRange(), base, length);
  }

  isArrayType(): this is ArrayType { return true }
}
