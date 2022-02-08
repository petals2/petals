import { Block } from "..";

export abstract class Stack<T extends string = string> extends Block<T> {
    isStack(): this is Stack { return true }
}