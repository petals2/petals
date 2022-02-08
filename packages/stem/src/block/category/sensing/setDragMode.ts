import { ValueField } from "../../field/value";
import { BlockKind } from "../../kinds";

export class SetDragMode extends BlockKind.Stack<"sensing_setdragmode"> {
  constructor(dragMode: "draggable" | "not draggable") {
    super("sensing_setdragmode");

    this.setDragMode(dragMode);
  }

  setDragMode(dragMode: "draggable" | "not draggable"): this {
    this.setField("DRAG_MODE", new ValueField(dragMode));

    return this;
  }

  getDragMode(): string {
    const field = this.getField("DRAG_MODE");

    if (!(field instanceof ValueField)) {
      throw new Error("SetDragMode DRAG_MODE field is not a value field");
    }

    return field.getValue() as string;
  }
}
