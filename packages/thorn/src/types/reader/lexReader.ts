import { LexedContextualError } from "../../errors/lexedContextual";
import { Token, TokenType } from "../token";
import { Reader } from "petals-utils";

export class LexReader implements Reader {
  protected readHead: number = 0;

  protected readonly contents: Token[]

  constructor(contents: Token[]) {
    this.contents = contents.filter(token => token.type !== TokenType.Comment)
  }

  read(): Token {
    return this.contents[this.readHead++];
  }

  peek(index: number = 0): Token {
    return this.contents[this.readHead + index];
  }

  expect<T extends ({ type: TokenType } | Token)[]>(...items: T): ({ [key in keyof T]: T[key] extends { type: infer Type, value: infer Value } ? { type: Type, value: Value } : T[key] extends { type: infer Type } ? Extract<Token, { type: Type }> : unknown })[number] {
    if (this.nextIs(...items)) {
      return this.read() as any;
    };

    if (!this.peek()) {
      throw new LexedContextualError(`Expected one of [${items.map(e => TokenType[e.type] + ("value" in e ? `<${JSON.stringify(e.value)}>` : `<any>`))}] found EOL`, this.contents, [this.readHead - 1, this.readHead - 1])
    }

    throw new LexedContextualError(`Expected one of [${items.map(e => TokenType[e.type] + ("value" in e ? `<${JSON.stringify(e.value)}>` : `<any>`))}] found ${this.peek().type + ("value" in this.peek() ? `<${JSON.stringify(this.peek().value)}>` : `<any>`)}`, this.contents, [this.readHead - 1, this.readHead - 1])
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

    return new LexReader(tokens.slice(1, -1));
  }

  toString(): string {
    return this.contents.map(token => token.value).join(" ");
  }
}
