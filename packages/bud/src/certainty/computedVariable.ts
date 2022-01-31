import { ComputedValue } from "./computedValue";
import { CollectedTerms, isTrue } from "./collectedTerms";
import { Computed } from "./computed";
import { Uncertain } from "./uncertain";


export class ComputedVariable extends Computed {
    knownVariables: Record<string, ComputedValue>;

    constructor(
        private readonly variableId: string
    ) {
        super();
        
        this.knownVariables = {
            "abc": new ComputedValue(5)
        }
    }

    getVariableId() {
        return this.variableId;
    }

    getKnownValue() {
        return this.knownVariables[this.variableId];
    }

    collectLikeTerms(): CollectedTerms {
        const knownValue = this.getKnownValue();
        const collected = new CollectedTerms;

        if (knownValue) {
            collected.addNumber(knownValue);
        } else {
            collected.addTerm(this.getVariableId(), new ComputedValue(1));
        }

        return collected;
    }

    equalTo(other: Computed): Computed {
        if (other instanceof ComputedValue) {
            const knownValue = this.getKnownValue();
            if (knownValue) {
                return knownValue.equalTo(other);
            }
            return new Uncertain;
        }

        if (other instanceof ComputedVariable) {
            if (this.getVariableId() === other.getVariableId()) {
                return new ComputedValue(1);
            }

            const myKnownValue = this.getKnownValue();
            const otherKnownValue = other.getKnownValue();

            if (isTrue(myKnownValue.equalTo(otherKnownValue))) {
                return new ComputedValue(1)
            }

            return new Uncertain;
        }

        return other.equalTo(this);
    }
}
