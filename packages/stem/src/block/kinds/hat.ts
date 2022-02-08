import { Block } from "..";

export abstract class Hat<T extends string = string> extends Block<T> {
    isHat(): this is Hat { return true }
}