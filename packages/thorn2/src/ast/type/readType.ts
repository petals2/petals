import { Type } from ".";
import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenType } from "../../lexer/token";
import { AnyType } from "./any";
import { ArrayType } from "./array";
import { BooleanType } from "./boolean";
import { NumberType } from "./number";
import { StringType } from "./string";
import { VoidType } from "./void";

export function readType(reader: LexReader) {
  let v = readBaseType(reader);
  let lv = undefined;

  while (v != lv) {
    lv = v;
    v = readComplexType(v, reader);
  }

  return v;
}

export function readComplexType(base: Type, reader: LexReader) {
  if (reader.nextIs({ type: TokenType.Separator, value: "[" })) {
    return ArrayType.build(base, reader);
  }

  return base;
}

export function readBaseType(reader: LexReader) {
  if (reader.nextIs({ type: TokenType.Identifier, value: "string" })) {
    return StringType.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Identifier, value: "number" })) {
    return NumberType.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Identifier, value: "boolean" })) {
    return BooleanType.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Identifier, value: "void" })) {
    return VoidType.build(reader);
  }

  if (reader.nextIs({ type: TokenType.Identifier, value: "any" })) {
    return AnyType.build(reader);
  }

  reader.openRange();

  reader.pushLexError(new UnexpectedTokenError("Expected type", reader.read(), reader.closeRange()));

  // never reached (pushLexError throws), but needed for typescript
  throw 0;
}
