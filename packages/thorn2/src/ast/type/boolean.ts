import { Type } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenType } from "../../lexer/token";

export class BooleanType extends Type {
  static build(reader: LexReader): BooleanType {
    reader.openRange();

    reader.expect({ type: TokenType.Identifier, value: "boolean" });

    return new BooleanType(reader.closeRange());
  }

  isBooleanType(): this is BooleanType { return true }
}
