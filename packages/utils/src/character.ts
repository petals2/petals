import { BoolExtends } from "./boolExtends";

export class Character<C extends string = string> {
  constructor(public readonly pos: number, protected readonly character: C) {}

  is<Input extends Character<string> | string>(c: Input): Input extends Character<infer InputC> ? BoolExtends<string, C, InputC> : Input extends string ? BoolExtends<string, C, Input> : unknown {
    if (c instanceof Character) {
      return (c.value() === this.value()) as any;
    }

    if (typeof c === "string") {
      return (c as any === this.value()) as any;
    }

    throw new Error("Input type is not valid.");
  }

  isOneOf<Input extends (Character | string)[]>(...c: Input): boolean {
    for (let i = 0; i < c.length; i++) {
      const el = c[i];

      if (this.is(el)) {
        return true as any;
      }
    }

    return false as any;
  }

  value(): C {
    return this.character;
  }
}
