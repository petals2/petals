import { BroadcastField } from "./broadcast";
import { ListField } from "./list";
import { ValueField } from "./value";
import { VariableField } from "./variable";

export type SerializedField = ReturnType<Field["serialize"]>;
export type Field = ValueField | VariableField | BroadcastField | ListField;
