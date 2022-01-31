import { CollectedTerms } from "./collectedTerms";
import { Computed } from "./computed";

export class ComputedDiv extends Computed {
    constructor(
        public readonly left: Computed,
        public readonly right: Computed
    ) {
        super();
    }

    collectLikeTerms(): CollectedTerms {
        const collected = this.left.collectLikeTerms();

        return collected.multiplyReciprocal(this.right.collectLikeTerms());
    }

    equalTo(other: Computed): Computed {
        return this.collectLikeTerms().equalTo(other.collectLikeTerms());
    }
}
