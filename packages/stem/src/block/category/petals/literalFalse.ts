import { And } from "../operators/and";

export class LiteralFalse extends And {
    constructor() {
        super(undefined, undefined);
    }
}