import { Computed } from "./computed";

export class ComputedValue extends Computed {
    constructor(
        public readonly value: string|number
    ) {
        super();
    }

    add(other: Computed): Computed {
        if (other instanceof ComputedValue) {
            return new ComputedValue(parseInt(this.value as string) + parseInt(other.value as string));
        }

        return other.add(this);
    }

    mul(other: Computed): Computed {
        if (other instanceof ComputedValue) {
            return new ComputedValue(parseInt(this.value as string) * parseInt(other.value as string));
        }

        return other.add(this);
    }

    equalTo(other: Computed): Computed {
        if (other instanceof ComputedValue) {
            return new ComputedValue(this.value === other.value ? 1 : 0);
        }

        return other.equalTo(this);
    }
}
