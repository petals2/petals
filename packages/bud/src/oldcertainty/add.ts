import { Uncertain } from ".";
import { ComputedValue } from "./computedValue";
import { Computed } from "./computed";
import { CertainEqual } from "./equal";
import { ComputedMul } from "./mul";

export function isTrue(computed: Computed) {
    return computed instanceof ComputedValue && computed.value === 1;
}

export class ComputedAdd extends Computed {
    constructor(
        public readonly left: Computed,
        public readonly right: Computed
    ) {
        super();
    }

    add(other: Computed): Computed {
        return new ComputedAdd(this, other);
    }

    mul(other: Computed): Computed {
        return new ComputedMul(this, other);
    }

    equalTo(other: Computed): Computed {
        if (other instanceof ComputedAdd) {
            const tlol = this.left.equalTo(other.left);
            const tror = this.right.equalTo(other.right);

            if (isTrue(tlol) && isTrue(tror)) {
                return new ComputedValue(1);
            }

            const trol = this.right.equalTo(other.left);
            const tlor = this.left.equalTo(other.right);

            if (isTrue(trol) && isTrue(tlor)) {
                return new ComputedValue(1);
            }

            if ((tlol instanceof Uncertain || tror instanceof Uncertain) && (trol instanceof Uncertain || tlor instanceof Uncertain)) {
                return new Uncertain;
            }

            return new ComputedValue(0);
        }

        if (other instanceof ComputedMul) {

        }
        
        if (other instanceof CertainEqual) {
            return this.left.add(this.right).equalTo(other.value);
        }
        
        return other.equalTo(this.left.add(this.right));
    }
}
