import { Type } from ".";
import { LexReader } from "../../lexer/lexReader";
import { TokenType } from "../../lexer/token";

export class VoidType extends Type {
  static build(reader: LexReader): VoidType {
    reader.openRange();

    reader.expect({ type: TokenType.Identifier, value: "void" });

    return new VoidType(reader.closeRange());
  }

  isVoidType(): this is VoidType { return true }
}
