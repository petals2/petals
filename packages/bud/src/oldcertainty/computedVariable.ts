import { Uncertain } from "./uncertain";
import { ComputedValue } from "./computedValue";
import { Computed } from "./computed";

const knownVariables: Record<string, ComputedValue> = {
    "abc": new ComputedValue(5)
};

export class ComputedVariable extends Computed {
    constructor(
        public readonly variableId: string
    ) {
        super();
    }

    add(other: Computed): Computed {
        const knownValue = knownVariables[this.variableId];
        if (knownValue !== undefined) {
            return knownValue.add(other);
        }

        return new Uncertain;
    }

    mul(other: Computed): Computed {
        const knownValue = knownVariables[this.variableId];
        if (knownValue !== undefined) {
            return knownValue.mul(other);
        }

        return new Uncertain;
    }

    equalTo(other: Computed): Computed {
        if (other instanceof ComputedValue) {
            const knownValue = knownVariables[this.variableId];
            if (knownValue !== undefined) {
                return knownValue.equalTo(other);
            }
            return new Uncertain;
        }

        if (other instanceof ComputedVariable) {
            if (this.variableId === other.variableId) {
                return new ComputedValue(1);
            }

            const thisKnown = knownVariables[this.variableId];
            const otherKnown = knownVariables[this.variableId];

            if (thisKnown !== undefined && otherKnown !== undefined) {
                return new ComputedValue(0);
            }

            return new Uncertain;
        }

        return other.equalTo(this);
    }
}
