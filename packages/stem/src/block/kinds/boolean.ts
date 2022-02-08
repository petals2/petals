import { Reporter } from "./reporter";

export abstract class Boolean<T extends string = string> extends Reporter<T> {
  isBoolean(): this is Boolean { return true }
}