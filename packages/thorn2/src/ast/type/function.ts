import { Type } from ".";
import { UnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";
import { readType } from "./readType";

export class FunctionType extends Type {
  constructor(
    range: TokenRange,
    protected readonly args: Type[],
    protected readonly returnType: Type
  ) { super(range) }

  static build(reader: LexReader): FunctionType {
    reader.openRange();

    if (!reader.nextIs({ type: TokenType.Separator, value: "(" })) {
      reader.pushLexError(new UnexpectedTokenError("Expected function type", reader.read(), reader.closeRange()));
    }

    const argumentReader = reader.readBetween("(");
    const args: Type[] = [];

    while (!argumentReader.isComplete()) {
      args.push(readType(argumentReader));

      if (argumentReader.isComplete()) break;

      argumentReader.expect({ type: TokenType.Separator, value: "," });
    }

    reader.expect({ type: TokenType.Separator, value: "=>" });

    const returnType = readType(reader);

    return new FunctionType(reader.closeRange(), args, returnType);
  }

  isFunctionType(): this is FunctionType { return true }
}
