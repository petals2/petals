import { C } from "./c";

export abstract class E<T extends string = string> extends C<T> {
    isE(): this is E { return true }
}