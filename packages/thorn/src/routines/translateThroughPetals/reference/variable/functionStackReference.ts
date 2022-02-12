import { Block, Blocks, Input, List, NumberInput, Target } from "petals-stem";

import { Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { StructTool } from "../../structTool";
import { VariableReference } from "./abstract";

export class VariableFunctionStackReference extends VariableReference {
  constructor(public readonly list: List, public readonly contentType: Type) {
    super();
  }

  performSideEffects(target: Target, thread: Block, context: Context): void { }

  changeValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ReplaceItemOfList> {
    return thread.getTail().append(
      target.getBlocks().createBlock(Blocks.Variables.ReplaceItemOfList, this.list,
        Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Multiply,
          Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___cidx")),
          Input.shadowed(new NumberInput(StructTool.getSize(this.contentType)))
        )),
        Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Add,
          Input.shadowed(target.getBlocks().createBlock(Blocks.Variables.ItemOfList,
            this.list,
            Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Multiply,
              Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___cidx")),
              Input.shadowed(new NumberInput(StructTool.getSize(this.contentType)))
            ))
          )),
          value,
        ))
      )
    )
  }

  setValue(value: Input, target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ReplaceItemOfList> {
    return thread.getTail().append(
      target.getBlocks().createBlock(Blocks.Variables.ReplaceItemOfList, this.list,
        Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Multiply,
          Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___cidx")),
          Input.shadowed(new NumberInput(StructTool.getSize(this.contentType)))
        )),
        value,
      )
    )
  }

  getValue(target: Target, thread: Block, context: Context): InstanceType<typeof Blocks.Variables.ItemOfList> {
    return target.getBlocks().createBlock(Blocks.Variables.ItemOfList, this.list,
      Input.shadowed(target.getBlocks().createBlock(Blocks.Operators.Multiply,
        Input.shadowed(target.getBlocks().createBlock(Blocks.Argument.ReporterStringNumber, "___cidx")),
        Input.shadowed(new NumberInput(StructTool.getSize(this.contentType)))
      ))
    );
  }
}