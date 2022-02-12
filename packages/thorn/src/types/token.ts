export const validComparators = <const> ["<=", ">=", "<", ">", "==", "!="];
export const validSeparators = <const> ["{", "}", "[", "]", "(", ")", ".", ",", "=", ";", ":", "|", "<", ">", "&"];
export const validOperators = <const> ["--", "++", "+", "-", "*", "/", "!"];
export const validKeywords = <const> [
  "constructor",
  "protected",
  "readonly",
  "function",
  "private",
  "struct",
  "return",
  "public",
  "catch",
  "class",
  "while",
  "throw",
  "heap",
  "this",
  "else",
  "free",
  "for",
  "new",
  "try",
  "var",
  "if",
];

export enum TokenType {
  BooleanLiteral,
  StringLiteral,
  NumberLiteral,
  Comparison,
  Identifier,
  Separator,
  Operator,
  Comment,
  Keyword,
}

export type Token = {
  startPos: number,
  endPos: number,
} & ({
  type: TokenType.BooleanLiteral,
  value: boolean,
} | {
  type: TokenType.StringLiteral,
  value: string,
} | {
  type: TokenType.Identifier,
  value: string,
} | {
  type: TokenType.Comment,
  value: string,
} | {
  type: TokenType.NumberLiteral,
  value: number,
} | {
  type: TokenType.Comparison,
  value: (typeof validComparators)[number],
} | {
  type: TokenType.Separator,
  value: (typeof validSeparators)[number],
} | {
  type: TokenType.Operator,
  value: (typeof validOperators)[number],
} | {
  type: TokenType.Keyword,
  value: (typeof validKeywords)[number],
});

export class TokenRange {
  static fromArray(tokens: Token[]) {
    const start = tokens[0];
    const end = tokens[tokens.length - 1];

    return new TokenRange(start, end);
  }

  static fromNodes<T extends { getTokenRange(): TokenRange }>(nodes: T[]) {
    const start = nodes[0];
    const end = nodes[nodes.length - 1];

    return new TokenRange(start.getTokenRange().getStart(), end.getTokenRange().getEnd());
  }

  protected readonly start: Token;
  protected readonly end: Token;

  constructor(
    start: Token|TokenRange,
    end?: Token|TokenRange
  ) {
    if (end) {
      this.start = start instanceof TokenRange ? start.getStart() : start;
      this.end = end instanceof TokenRange ? end.getEnd() : end;
    } else {
      this.start = start instanceof TokenRange ? start.getStart() : start;
      this.end = start instanceof TokenRange ? start.getEnd() : start;
    }
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  expand(other: TokenRange) {
    const start = other.getStart().startPos < this.start.startPos
      ? other.getStart()
      : this.start;

    const end = other.getEnd().endPos > this.end.endPos
      ? other.getEnd()
      : this.end;

    return new TokenRange(start, end);
  }
}
