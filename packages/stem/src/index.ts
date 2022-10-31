import {
    Argument as _Argument,
    Control as _Control,
    Events as _Events,
    Looks as _Looks,
    Motion as _Motion,
    Operators as _Operators,
    Petals as _Petals,
    Procedures as _Procedures,
    Sensing as _Sensing,
    Sound as _Sound,
    Variables as _Variables,
    Phantom as _Phantom
} from "./block";

export namespace Blocks {
    export const Argument = _Argument;
    export const Control = _Control;
    export const Events = _Events;
    export const Looks = _Looks;
    export const Motion = _Motion;
    export const Operators = _Operators;
    export const Petals = _Petals;
    export const Procedures = _Procedures;
    export const Sensing = _Sensing;
    export const Sound = _Sound;
    export const Variables = _Variables;
    export const Phantom = _Phantom;
}

export { StopOption } from "./block";

export * from "./block/field";
export * from "./block/input";
export * from "./block/kinds";
export * from "./block/block";
export * from "./block/store";

export * from "./asset";
export * from "./broadcast";
export * from "./comment";
export * from "./costume";
export * from "./id";
export * from "./list";
export * from "./project";
export * from "./sound";
export * from "./target";
export * from "./types";
export * from "./variable";
