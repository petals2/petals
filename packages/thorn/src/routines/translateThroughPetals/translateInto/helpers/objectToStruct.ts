import { Block, Target } from "petals-stem";
import { ObjectLiteralNode } from "../../../../types/ast/nodes/objectLiteral";
import { StructLiteralNode } from "../../../../types/ast/nodes/structLiteral";
import { StructureType } from "../../../../types/ast/type";
import { Context } from "../../context";
import { getListReference } from "../../reference/list";
import { ListReference } from "../../reference/list/abstract";

export function objectToStructListReference(object: ObjectLiteralNode, type: StructureType, target: Target, thread: Block, context: Context): ListReference {
  return getListReference(new StructLiteralNode(object.getTokenRange(), type, object.getValue()), target, thread, context);
}
