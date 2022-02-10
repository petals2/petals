import { Block } from "../block";

export abstract class Reporter<T extends string = string> extends Block<T> {
    isReporter(): this is Reporter { return true }
}
