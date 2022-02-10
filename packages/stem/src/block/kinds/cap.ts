import { Block } from "../block";

export class Cap<T extends string = string> extends Block<T> {
    isCap(): this is Cap { return true }
}
