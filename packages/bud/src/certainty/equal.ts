import { Uncertain } from "./uncertain";
import { Computed } from "./computed";
import { ComputedValue } from "./computedValue";

export class CertainEqual extends Computed {
    constructor(
        public readonly value: Computed
    ) {
        super();
    }

    add(other: Computed): Computed {
        return new CertainEqual(this.value.add(other));
    }

    mul(other: Computed): Computed {
        return new CertainEqual(this.value.mul(other));
    }

    equalTo(other: Computed): Computed {
        if (other instanceof CertainEqual) {
            return new CertainEqual(this.value.equalTo(other.value));
        }
        
        if (other instanceof ComputedValue) {
            return this.value.equalTo(other);
        }

        return new Uncertain;
    }
}
