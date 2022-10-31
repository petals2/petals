import { Type } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenType } from "../../lexer/token";

export class AnyType extends Type {
  static build(reader: LexReader): AnyType {
    reader.openRange();

    reader.expect({ type: TokenType.Identifier, value: "any" });

    return new AnyType(reader.closeRange());
  }

  isAnyType(): this is AnyType { return true }
}
