import { Type } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenType } from "../../lexer/token";

export class StringType extends Type {
  static build(reader: LexReader): StringType {
    reader.openRange();

    reader.expect({ type: TokenType.Identifier, value: "string" });

    return new StringType(reader.closeRange());
  }

  isStringType(): this is StringType { return true }
}
