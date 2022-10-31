import { Type } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenType } from "../../lexer/token";

export class NumberType extends Type {
  static build(reader: LexReader): NumberType {
    reader.openRange();

    reader.expect({ type: TokenType.Identifier, value: "number" });

    return new NumberType(reader.closeRange());
  }

  isNumberType(): this is NumberType { return true }
}
