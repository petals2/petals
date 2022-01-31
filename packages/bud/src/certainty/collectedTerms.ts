import { ComputedAdd } from "./add";
import { Computed } from "./computed";
import { ComputedReciprocal } from "./computedReciprocal";
import { ComputedValue } from "./computedValue";
import { ComputedVariable } from "./computedVariable";
import { ComputedMul } from "./mul";
import { ComputedSub } from "./sub";

export function isTrue(computed: Computed) {
    return computed instanceof ComputedValue && computed.getValue() === 1;
}

export class CollectedTerms {
    private collectedTerms: Map<string, Computed>;
    private number: number;

    constructor() {
        this.collectedTerms = new Map;
        this.number = 0;
    }

    getTerms() {
        return this.collectedTerms;
    }

    getNumber() {
        return this.number;
    }

    getCoefficient(term: string) {

    }

    addNumber(value: ComputedValue) {
        this.number += value.getValue();
    }

    addTerm(term: string, value: Computed) {
        const collected = this.collectedTerms.get(term);

        if (!collected)
            return this.collectedTerms.set(term, value);

        if (value instanceof ComputedValue && collected instanceof ComputedValue) {
            this.collectedTerms.set(term, new ComputedValue(collected.getValue() + value.getValue()));
        } else {
            this.collectedTerms.set(term, new ComputedAdd(collected, value));
        }
    }

    multiplyTerm(term: string, value: Computed) {
        const collected = this.collectedTerms.get(term);

        if (!collected)
            return;

        if (value instanceof ComputedValue && collected instanceof ComputedValue) {
            this.collectedTerms.set(term, new ComputedValue(collected.getValue() * value.getValue()));
        } else {
            this.collectedTerms.set(term, new ComputedMul(collected, value));
        }
    }

    getTerm(term: string) {
        return this.collectedTerms.get(term);
    }

    getNegated() {
        const newCollected = new CollectedTerms;
        for (const [ term, value ] of this.collectedTerms) {
            if (value instanceof ComputedValue) {
                newCollected.addTerm(term, new ComputedValue(-value.getValue()));
                continue;
            }
            newCollected.addTerm(term, new ComputedSub(new ComputedValue(0), value));
        }
        newCollected.addNumber(new ComputedValue(-this.number));
        return newCollected;
    }

    addTerms(other: CollectedTerms) {
        const otherTerms = other.getTerms();
        for (const [ term, value ] of otherTerms) {
            this.addTerm(term, value);
        }
        this.number += other.number;
        return this;
    }

    subTerms(other: CollectedTerms) {
        return this.addTerms(other.getNegated());
    }

    multiplyTerms(other: CollectedTerms) {
        const myTerms = this.getTerms();
        const otherTerms = other.getTerms();

        const newCollection = new CollectedTerms;
        for (const [ myTerm, myValue ] of myTerms) {
            for (const [ otherTerm, otherValue ] of otherTerms) {
                newCollection.addTerm(myTerm, new ComputedMul(myValue, new ComputedMul(new ComputedVariable(otherTerm), otherValue)));
                if (otherTerm !== myTerm) {
                    newCollection.addTerm(otherTerm, new ComputedMul(new ComputedVariable(myTerm), myValue));
                }
            }
            if (other.number !== 0) {
                newCollection.addTerm(myTerm, new ComputedMul(myValue, new ComputedValue(other.number)));
            }
        }
        
        for (const [ otherTerm, otherValue ] of otherTerms) {
            newCollection.addTerm(otherTerm, new ComputedMul(otherValue, new ComputedValue(this.number)));
        }

        newCollection.number = this.number * other.number;
        return newCollection;
    }

    multiplyReciprocal(other: CollectedTerms) {
        const myTerms = this.getTerms();
        const otherTerms = other.getTerms();

        const newCollection = new CollectedTerms;
        for (const [ myTerm, myValue ] of myTerms) {
            for (const [ otherTerm, otherValue ] of otherTerms) {
                newCollection.addTerm(myTerm, new ComputedMul(myValue, new ComputedReciprocal(new ComputedMul(new ComputedVariable(otherTerm), otherValue))));
                newCollection.addTerm(otherTerm, new ComputedReciprocal(new ComputedMul(new ComputedVariable(myTerm), myValue)));
            }
            newCollection.addTerm(myTerm, new ComputedReciprocal(new ComputedValue(other.number)));
        }
        
        for (const [ otherTerm ] of otherTerms) {
            newCollection.addTerm(otherTerm, new ComputedReciprocal(new ComputedValue(this.number)));
        }

        if (other.number !== 0) {
            newCollection.number = this.number * (1 / other.number);
        }
        return newCollection;
    }

    equalTo(other: CollectedTerms) {
        const myTerms = this.getTerms();
        const otherTerms = other.getTerms();

        if (this.getNumber() !== other.getNumber())
            return new ComputedValue(0);

        for (const [ myTerm, value ] of myTerms) {
            const otherValue = other.getTerm(myTerm) || new ComputedValue(0);
            if (!isTrue(value.equalTo(otherValue))) {
                return new ComputedValue(0);
            }
        }

        for (const [ otherTerm, value ] of otherTerms) {
            if (!this.getTerm(otherTerm) && !isTrue(value.equalTo(new ComputedValue(0))))
                return new ComputedValue(0);
        }

        return new ComputedValue(1);
    }
}
