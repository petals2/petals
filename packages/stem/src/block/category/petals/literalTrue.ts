import { Not } from "../operators/not";

export class LiteralTrue extends Not {
    constructor() {
        super(undefined);
    }
}