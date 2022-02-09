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
}
