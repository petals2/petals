import { CollectedTerms } from "./collectedTerms";
import { Computed } from "./computed";

export class ComputedValue extends Computed {
    constructor(
        private readonly value: number
    ) {
        super();
    }

    getValue() {
        return this.value;
    }

    collectLikeTerms(): CollectedTerms {
        const collected = new CollectedTerms;
        collected.addNumber(this);
        return collected;
    }

    equalTo(other: Computed): Computed {
        if (other instanceof ComputedValue) {
            return new ComputedValue(this.getValue() === other.getValue() ? 1 : 0);
        }

        return other.equalTo(this);
    }
}
