import { Character } from "../character";
import { StringContextualError } from "../errors";
import { Reader } from "./reader";

export class StringReader implements Reader {
  constructor(protected readonly content: string) {}

  protected readHead: number = 0;

  read(): Character {
    return new Character(this.content[this.readHead++]);
  }

  peek(idx: number = 0): Character {
    return new Character(this.content[this.readHead + idx]);
  }

  isComplete(): boolean {
    return this.readHead === this.content.length;
  }

  expect<Input extends (Character | string)[]>(...items: Input): Input extends Character<infer Char>[] ? Char[number] : Input extends string[] ? Input[number] : unknown {
    if (items.every(i => i instanceof Character || i.length === 1)) {
      const char = this.read();
  
      if (char.isOneOf(...items)) {
        return char.value() as any;
      }
    } else {
      const item = this.nextIsOne(...items.map(el => el instanceof Character ? el.value() : el));

      if (item) {
        this.readHead += item.length;

        return item as any;
      }
    }

    throw new StringContextualError(`Expected one of [${items.map(e => e instanceof Character ? e.value() : e).join(", ")}] found ${this.read().value()}`, this.content, [this.readHead - 1, this.readHead - 1]);
  }

  readUntil(...c: (Character | string)[]): string {
    let str = "";

    while(!this.peek().isOneOf(...c) && !this.isComplete()) {
      str += this.read().value();
    }

    return str;
  }

  readUntilNot(...c: (Character | string)[]): string {
    let str = "";

    while (this.peek().isOneOf(...c) && !this.isComplete()) {
      str += this.read().value();
    }

    return str;
  }

  nextIs(test: string): boolean {
    for (let j = 0; j < test.length; j++) {
      const char = test[j];

      if (!this.peek(j).is(char)) {
        return false;
      }
    }

    return true;
  }

  nextIsOne<T extends string[]>(...strings: T): T[number] | void {
    for (let i = 0; i < strings.length; i++) {
      const element = strings[i];

      if (this.nextIs(element)) {
        return element;
      }
    }

    return;
  }
}
