import { CollectedTerms } from "./collectedTerms";
import { Computed } from "./computed";

export class Uncertain extends Computed {
    constructor() {
        super();
    }

    collectLikeTerms(): CollectedTerms {
        return new CollectedTerms;
    }

    equalTo(other: Computed) {
        return new Uncertain;
    }
}
