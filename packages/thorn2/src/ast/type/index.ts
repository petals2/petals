import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";
import type { AnyType } from "./any";
import type { ArrayType } from "./array";
import type { BooleanType } from "./boolean";
import type { FunctionType } from "./function";
import type { NumberType } from "./number";
import type { StringType } from "./string";
import type { VoidType } from "./void";

export abstract class Type {
  constructor(protected readonly tokenRange?: TokenRange) { }

  getTokenRange() {
    return this.tokenRange;
  }

  isFunctionType(): this is FunctionType { return false }
  isBooleanType(): this is BooleanType { return false }
  isStringType(): this is StringType { return false }
  isNumberType(): this is NumberType { return false }
  isArrayType(): this is ArrayType { return false }
  isVoidType(): this is VoidType { return false }
  isAnyType(): this is AnyType { return false }
}
