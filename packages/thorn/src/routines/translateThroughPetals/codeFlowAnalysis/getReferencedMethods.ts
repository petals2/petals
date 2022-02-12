import { TreeNode } from "../../../types/ast/node";
import { VariableReferenceNode } from "../../../types/ast/nodes/variableReference";
import { Context } from "../context";
import { getType } from "../getType";

export function getReferencedMethods(context: Context, ...codeBlock: TreeNode[]): string[] {
  const methods: string[] = [];

  for (const node of codeBlock) {
    switch (node.type) {
      case "arrayLiteral": 
        methods.push(...getReferencedMethods(context, ...node.getValues()));
        break;
      case "mathOperation":
      case "comparisonOperation":
        methods.push(...getReferencedMethods(context, node.getLeftHand()), ...getReferencedMethods(context, node.getRightHand()));
        break;
      case "negateOperator":
      case "incrementOperator":
      case "decrementOperator": 
        methods.push(...getReferencedMethods(context, node.getNode()));
        break;
      case "forNode": 
        methods.push(
          ...getReferencedMethods(context, node.getFirstStep()),
          ...getReferencedMethods(context, node.getSecondStep()),
          ...getReferencedMethods(context, node.getThirdStep()),
          ...getReferencedMethods(context, ...node.getContents()),
        );
        break;
      case "ifBlock": 
        methods.push(
          ...getReferencedMethods(context, node.getComparison()),
          ...getReferencedMethods(context, ...node.getContents()),
          ...getReferencedMethods(context, ...(node.getElseContents() ?? [])),
        );
        break;
      case "methodCall":
        if (node.getBaseValue().type !== "variableReference") {
          const t = getType(node.getBaseValue(), context);

          if (!t.isStructureType() && !t.isReferenceType() && !t.isSelfType()) {
            throw new Error("Method call base must be variable reference or of class type");
          }

          return ["___" + t.getName() + "_" + node.getBaseValue()];
        }

        methods.push((node.getBaseValue() as VariableReferenceNode).getName());
        break;
      case "methodDefinition":
        methods.push(...getReferencedMethods(context, ...node.getContents()));
        break;
      case "parenthesisedExpressionNode":
        methods.push(...getReferencedMethods(context, node.getContents()));
        break;
      case "propertyReference":
        methods.push(...getReferencedMethods(context, node.getParent()));
        break;
      case "return":
        methods.push(...getReferencedMethods(context, node.getValue()));
        break;
      case "structLiteral":
        methods.push(...getReferencedMethods(context, ...Object.values(node.getValue())));
        break;
      case "variableDefinition":
        if (node.getInitialValue()) {
          methods.push(...getReferencedMethods(context, node.getInitialValue()!));
        }
        break;
      case "variableRedefinition":
        methods.push(...getReferencedMethods(context, node.getNewValue()));
        break;
      case "while":
        methods.push(...getReferencedMethods(context, node.getCase()), ...getReferencedMethods(context, ...node.getBlock()));
        break;
      case "new":
        methods.push("___" + node.getClass() + "_constructor");
        break;
    }
  }

  return methods;
}
