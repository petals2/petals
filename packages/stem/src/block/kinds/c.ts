import { Stack } from "./stack";

export abstract class C<T extends string = string> extends Stack<T> {
    isC(): this is C { return true }
}