import { Variables } from "petals-stem/dist/src/block/category/variables";
import { Operators } from "petals-stem/dist/src/block/category/operators";
import { Argument } from "petals-stem/dist/src/block/category/argument";
import { Input } from "petals-stem/dist/src/block/input";
import { Target } from "petals-stem/dist/src/target";
import { VariableReference } from "./abstract";
import { Block } from "petals-stem/dist/src/block";
import { List } from "petals-stem/dist/src/list";
import { Context } from "../../context";
import { Type } from "../../../../types/ast/type";
import { NumberInput } from "petals-stem/dist/src/block/input/number";
import { StructTool } from "../../structTool";

export class VariableFunctionStackReference extends VariableReference {
  constructor(public readonly list: List, public readonly contentType: Type) {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ReplaceItemOfList> {
    return thread.getTail().append(
      target.getBlocks().createBlock(Variables.ReplaceItemOfList, this.list,
        Input.shadowed(target.getBlocks().createBlock(Operators.Multiply,
          Input.shadowed(target.getBlocks().createBlock(Argument.ReporterStringNumber, "___cidx")),
          Input.shadowed(new NumberInput(StructTool.getSize(this.contentType)))
        )),
        Input.shadowed(target.getBlocks().createBlock(Operators.Add,
          Input.shadowed(target.getBlocks().createBlock(Variables.ItemOfList,
            this.list,
            Input.shadowed(target.getBlocks().createBlock(Operators.Multiply,
              Input.shadowed(target.getBlocks().createBlock(Argument.ReporterStringNumber, "___cidx")),
              Input.shadowed(new NumberInput(StructTool.getSize(this.contentType)))
            ))
          )),
          value,
        ))
      )
    )
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ReplaceItemOfList> {
    return thread.getTail().append(
      target.getBlocks().createBlock(Variables.ReplaceItemOfList, this.list,
        Input.shadowed(target.getBlocks().createBlock(Operators.Multiply,
          Input.shadowed(target.getBlocks().createBlock(Argument.ReporterStringNumber, "___cidx")),
          Input.shadowed(new NumberInput(StructTool.getSize(this.contentType)))
        )),
        value,
      )
    )
  }

  getValue(target: Target, thread: Block, context: Context): InstanceType<typeof Variables.ItemOfList> {
    return target.getBlocks().createBlock(Variables.ItemOfList, this.list,
      Input.shadowed(target.getBlocks().createBlock(Operators.Multiply,
        Input.shadowed(target.getBlocks().createBlock(Argument.ReporterStringNumber, "___cidx")),
        Input.shadowed(new NumberInput(StructTool.getSize(this.contentType)))
      ))
    );
  }
}
