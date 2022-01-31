import { ComputedValue } from "./computedValue";
import { CollectedTerms } from "./collectedTerms";
import { Computed } from "./computed";
import { Uncertain } from "./uncertain";
import { ComputedVariable } from "./computedVariable";


export class ComputedReciprocal extends Computed {
    constructor(
        private readonly value: Computed
    ) {
        super();
    }

    getValue() {
        return this.value;
    }

    collectLikeTerms(): CollectedTerms {
        return this.value.collectLikeTerms();
    }

    equalTo(other: Computed): Computed {
        if (other instanceof ComputedValue) {
            return new Uncertain;
        }

        if (other instanceof ComputedReciprocal) {
            return other.getValue().equalTo(this.value);
        }
        
        if (other instanceof ComputedVariable) {
            return new Uncertain;
        }

        return other.equalTo(this);
    }
}
