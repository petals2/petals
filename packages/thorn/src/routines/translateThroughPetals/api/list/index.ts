import { Block } from "petals-stem/dist/src/block";
import { Target } from "petals-stem/dist/src/target";
import { MethodCallNode } from "../../../../types/ast/nodes/methodCall";
import { NumberType, Type } from "../../../../types/ast/type";
import { Context } from "../../context";
import { ListReference } from "../../reference/list/abstract";
import { VariableReference } from "../../reference/variable/abstract";
import { NumberLiteralReference } from "../../reference/variable/numberLiteralReference";
import { callPush } from "./functions/push";
import { ListLengthReference } from "./lengthReference";

export namespace ListApi {
  export function getType(key: string): Type {
    switch(key) {
      case "length": return new NumberType();
    }
  
    throw new Error("Cannot access property " + key + " of a list.");
  }

  export function getVariableReference(list: ListReference, property: string, context: Context): VariableReference {
    switch(property) {
      case "length": {
        if (list.isKnownLength()) return new NumberLiteralReference(list.getKnownLength(context));

        return new ListLengthReference(list);
      }
    }

    throw new Error("Cannot access property " + property + " of a list.");
  }

  export function callListApi(list: ListReference, property: string, call: MethodCallNode, target: Target, thread: Block, context: Context): VariableReference | ListReference {
    switch(property) {
      case "push": return callPush(list, call, target, thread, context)
    }

    throw new Error("Cannot call method " + property + " on a list.");
  }
}
