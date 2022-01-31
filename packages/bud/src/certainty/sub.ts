import { CollectedTerms } from "./collectedTerms";
import { Computed } from "./computed";

export class ComputedSub extends Computed {
    constructor(
        public readonly left: Computed,
        public readonly right: Computed
    ) {
        super();
    }

    collectLikeTerms(): CollectedTerms {
        const collected = this.left.collectLikeTerms();
        const other = this.right.collectLikeTerms();

        return collected.subTerms(other);
    }

    equalTo(other: Computed): Computed {
        return this.collectLikeTerms().equalTo(other.collectLikeTerms());
    }
}
