import { LexedContextualError } from "../errors/lexedContextual";
import { Token, TokenRange, TokenType } from "./token";
import { Reader } from "petals-utils";
import { LexError } from "../errors/lexError";
import { UnexpectedTokenError } from "../errors/unexpectedToken";

export class LexReader implements Reader {
  protected readHead: number = 0;
  protected errors: LexError[];
  protected rangeStack: TokenRange[] = [];

  protected readonly contents: Token[];
  protected range: TokenRange;

  constructor(protected readonly file: string, contents: Token[], protected parent?: LexReader, range?: TokenRange) {
    this.contents = contents.filter(token => token.type !== TokenType.Comment);
    this.errors = [];
    this.range = range || TokenRange.fromArray(file, contents);
  }

  getFile() { return this.file }

  clone() {
    const newReader = new LexReader(this.file, this.contents, this.parent, this.range);

    (newReader as any).readHead = this.readHead;

    return newReader;
  }

  openRange() {
    this.rangeStack.push(new TokenRange(this.file, this.peek()));
  }

  closeRange() {
    const range = this.rangeStack.pop();

    if (range === undefined)
      throw new Error("Stack undeflow");

    range.setEnd(this.contents[this.readHead - 1]);

    return range;
  }

  getRange() {
    return this.range;
  }

  read(): Token {
    return this.contents[this.readHead++];
  }

  peek(index: number = 0): Token {
    return this.contents[this.readHead + index];
  }

  expect<T extends ({ type: TokenType } | Token)[]>(...items: T): ({ [key in keyof T]: T[key] extends { type: infer Type, value: infer Value } ? { type: Type, value: Value, startPos: number, endPos: number } : T[key] extends { type: infer Type } ? Extract<Token, { type: Type }> : unknown })[number] {
    if (this.nextIs(...items)) {
      return this.read() as any;
    };

    if (!this.peek()) {
      throw new UnexpectedTokenError(`Expected one of [${items.map(e => TokenType[e.type] + ("value" in e ? `<${JSON.stringify(e.value)}>` : `<any>`))}]`, undefined, this.closeRange())
    }

    throw new UnexpectedTokenError(`Expected one of [${items.map(e => TokenType[e.type] + ("value" in e ? `<${JSON.stringify(e.value)}>` : `<any>`))}]`, this.peek(), this.closeRange())
  }

  nextIs<T extends ({ type: TokenType } | Token)[]>(...items: T): boolean {
    const next = this.peek();

    if (!next) return false;

    return items.some(item => item.type === next.type && ("value" in item ? item.value === next.value : true));
  }

  isComplete(): boolean {
    return this.readHead === this.contents.length;
  }

  readUntil<T extends ({ type: TokenType } | Token)[]>(...items: T): Token[] {
    const tokens: Token[] = [];

    while (true) {
      if (this.nextIs(...items) || this.isComplete()) {
        break;
      }

      tokens.push(this.read());
    }

    return tokens;
  }

  readBetween(char: "(" | "[" | "{" | "<"): LexReader {
    const closingChar = String.fromCharCode(char.charCodeAt(0) + (char === "(" ? 1 : 2));

    const tokens: Token[] = [];
    let depth = 0;
    do {
      const token = this.read();

      if ((token.type === TokenType.Separator || token.type == TokenType.Comparison) && token.value === char) {
        depth++;
      }

      if ((token.type === TokenType.Separator || token.type == TokenType.Comparison) && token.value === closingChar) {
        depth--;
      }

      tokens.push(token);
    } while (depth !== 0)

    return new LexReader(this.file, tokens.slice(1, -1), this, TokenRange.fromArray(this.file, tokens));
  }

  pushLexError(error: LexError) {
    if (error.fatal) {
      throw error;
    }

    if (this.parent) {
      this.parent.pushLexError(error);
      return;
    }
    
    this.errors.push(error);
  }

  getErrors(): LexError[] {
    if (this.parent) {
      return this.parent.getErrors();
    }

    return this.errors;
  }

  toString(): string {
    return this.contents.map(token => token.value).join(" ");
  }
}
