import { ValueNode } from "../ast/node";
import { Token, TokenRange, TokenType } from "../lexer/token";
import { ErrorCode } from "./codes";
import { LexError } from "./lexError";
import { ThornError } from "./thornError";

export class InvalidLeftHand extends LexError {
  constructor(protected readonly stateError: string, protected readonly node: ValueNode | undefined, range: TokenRange) {
    super(ErrorCode.InvalidLeftHand, range, true);
  }

  getSummary() {
    return `Invalid left hand`;
  }

  getMessage() {
    return this.stateError;
  }
}
