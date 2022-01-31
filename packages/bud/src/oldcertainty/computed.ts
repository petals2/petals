export abstract class Computed {
    abstract add(other: Computed): Computed;
    abstract mul(other: Computed): Computed;
    abstract equalTo(other: Computed): Computed;
}
