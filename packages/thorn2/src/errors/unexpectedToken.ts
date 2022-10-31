import { Token, TokenRange, TokenType } from "../lexer/token";
import { ErrorCode } from "./codes";
import { LexError } from "./lexError";
import { ThornError } from "./thornError";

export class UnexpectedTokenError extends LexError {
  constructor(protected readonly stateError: string, protected readonly token: Token | undefined, range: TokenRange) {
    super(ErrorCode.UnexpectedToken, range, true);
  }

  getSummary() {
    if (this.token == undefined) {
      return `Unexpected EOF`;
    }

    return `Unexpected ${TokenType[this.token.type]}<${this.token.value === "string" ? `"${this.token.value}"` : this.token.value}>`;
  }

  getMessage() {
    return this.stateError;
  }
}

export class SafeUnexpectedTokenError extends LexError {
  constructor(protected readonly stateError: string, protected readonly token: Token, range: TokenRange) {
    super(ErrorCode.UnexpectedToken, range, false);
  }

  getSummary() {
    return `Unexpected ${TokenType[this.token.type]}<${this.token.value === "string" ? `"${this.token.value}"` : this.token.value}>`;
  }

  getMessage() {
    return this.stateError;
  }
}

export class SafeUnexpectedTokensError extends LexError {
  constructor(protected readonly stateError: string, file: string, protected readonly tokens: Token[]) {
    super(ErrorCode.UnexpectedToken, TokenRange.fromArray(file, tokens), false);
  }

  getSummary() {
    return `Unexpected tokens`;
  }

  getMessage() {
    return this.stateError;
  }
}
