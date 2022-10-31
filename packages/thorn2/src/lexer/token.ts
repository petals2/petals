export const validComparators = <const> ["<=", ">=", "<", ">", "==", "!="];
export const validSeparators = <const> ["+=", "-=", "*=", "/=", "=>", "{", "}", "[", "]", "(", ")", ".", ",", "=", ";", ":", "|", "<", ">", "&"];
export const validOperators = <const> ["--", "++", "+", "-", "*", "/", "!"];
export const validKeywords = <const> [
  "constructor",
  "protected",
  "readonly",
  "function",
  "private",
  "import",
  "struct",
  "return",
  "public",
  "yields",
  "export",
  "async",
  "catch",
  "const",
  "class",
  "while",
  "throw",
  "heap",
  "self",
  "this",
  "from",
  "else",
  "free",
  "for",
  "new",
  "try",
  "let",
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
  static fromArray(file: string, tokens: Token[]) {
    const start = tokens[0];
    const end = tokens[tokens.length - 1];

    return new TokenRange(file, start, end);
  }

  static fromNodes<T extends { getTokenRange(): TokenRange }>(nodes: T[]) {
    const start = nodes[0];
    const end = nodes[nodes.length - 1];

    return new TokenRange(start.getTokenRange().file, start.getTokenRange().getStart(), end.getTokenRange().getEnd());
  }

  protected readonly start: Token;
  protected end: Token;

  constructor(
    protected readonly file: string,
    start: Token|TokenRange,
    end?: Token|TokenRange,
  ) {
    if (end) {
      this.start = start instanceof TokenRange ? start.getStart() : start;
      this.end = end instanceof TokenRange ? end.getEnd() : end;
    } else {
      this.start = start instanceof TokenRange ? start.getStart() : start;
      this.end = start instanceof TokenRange ? start.getEnd() : start;
    }
  }

  getFile() {
    return this.file;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  setEnd(end: Token | TokenRange) {
    this.end = end instanceof TokenRange ? end.getEnd() : end;
  }

  encapsulate(other: TokenRange) {
    if (other.file !== this.file)
      throw new Error("TokenRange file mismatch during encapsulation");

    const start = other.getStart().startPos < this.start.startPos
      ? other.getStart()
      : this.start;

    const end = other.getEnd().endPos > this.end.endPos
      ? other.getEnd()
      : this.end;

    return new TokenRange(other.file, start, end);
  }
}
