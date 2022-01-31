import { Computed } from "./computed";

export class Uncertain extends Computed {
    constructor() {
        super();
    }

    add(other: Computed) {
        return new Uncertain;
    }

    mul(other: Computed){
        return new Uncertain;
    }

    equalTo(other: Computed) {
        return new Uncertain;
    }
}
