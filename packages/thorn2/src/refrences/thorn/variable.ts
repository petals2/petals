import { Block, Input, List, ListInput, NumberInput, Sprite, Stage, Variable, VariableInput } from "petals-stem";
import { Variables } from "petals-stem/dist/src/block";
import { Phantom } from "petals-stem/dist/src/block/category/phantom";
import { Definition } from "petals-stem/dist/src/block/category/procedures/definition";
import { FunctionDefinitionNode } from "../../ast/node/functionDefinition";
import { Type } from "../../ast/type";
import { BooleanType } from "../../ast/type/boolean";
import { VariableDefinitionNode } from "../../ast/node/variableDefinition";
import { ID, listNames, variableNames } from "../../id";
import { TranslationContext } from "../../translate/context";
import { getType } from "../../type";
import { ConstReporterReference } from "../petals/reporter/reporterReference";

export class ThornVariableRefrence {
  protected variable: Variable | List;

  constructor(
    protected readonly node: VariableDefinitionNode,
    protected readonly target: Sprite | Stage,
    protected readonly type: Type,
  ) {
    this.variable = type.isArrayType() ? target.getLists().createList(listNames.generate()) : target.getVariables().createVariable(variableNames.generate(), 0);
  }

  getScratchValue() {
    return this.variable;
  }

  getType(context: TranslationContext): Type {
    return this.node.getType() ?? getType(this.node.getValue(), context)
  }

  isConstant(): boolean {
    return this.node.isConstant();
  }
}
