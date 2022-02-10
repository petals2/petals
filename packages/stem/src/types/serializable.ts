export type Serializable<T> = T | { serialize(): T };
