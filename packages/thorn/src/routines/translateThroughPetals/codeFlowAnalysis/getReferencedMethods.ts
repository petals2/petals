import { TreeNode } from "../../../types/ast/node";
import { VariableReferenceNode } from "../../../types/ast/nodes/variableReference";

export function getReferencedMethods(...codeBlock: TreeNode[]): string[] {
  const methods: string[] = [];

  for (const node of codeBlock) {
    switch (node.type) {
      case "arrayLiteral": 
        methods.push(...getReferencedMethods(...node.getValues()));
        break;
      case "mathOperation":
      case "comparisonOperation":
        methods.push(...getReferencedMethods(node.getLeftHand()), ...getReferencedMethods(node.getRightHand()));
        break;
      case "negateOperator":
      case "incrementOperator":
      case "decrementOperator": 
        methods.push(...getReferencedMethods(node.getNode()));
        break;
      case "forNode": 
        methods.push(
          ...getReferencedMethods(node.getFirstStep()),
          ...getReferencedMethods(node.getSecondStep()),
          ...getReferencedMethods(node.getThirdStep()),
          ...getReferencedMethods(...node.getContents()),
        );
        break;
      case "ifBlock": 
        methods.push(
          ...getReferencedMethods(node.getComparison()),
          ...getReferencedMethods(...node.getContents()),
          ...getReferencedMethods(...(node.getElseContents() ?? [])),
        );
        break;
      case "methodCall":
        if (node.getBaseValue().type !== "variableReference")
          throw new Error("Method call base value must be a variable reference");
        methods.push((node.getBaseValue() as VariableReferenceNode).getName());
        break;
      case "methodDefinition":
        methods.push(...getReferencedMethods(...node.getContents()));
        break;
      case "parenthesisedExpressionNode":
        methods.push(...getReferencedMethods(node.getContents()));
        break;
      case "propertyReference":
        methods.push(...getReferencedMethods(node.getParent()));
        break;
      case "return":
        methods.push(...getReferencedMethods(node.getValue()));
        break;
      case "structLiteral":
        methods.push(...getReferencedMethods(...Object.values(node.getValue())));
        break;
      case "variableDefinition":
        if (node.getInitialValue()) {
          methods.push(...getReferencedMethods(node.getInitialValue()!));
        }
        break;
      case "variableRedefinition":
        methods.push(...getReferencedMethods(node.getNewValue()));
        break;
      case "while":
        methods.push(...getReferencedMethods(node.getCase()), ...getReferencedMethods(...node.getBlock()));
        break;
    }
  }

  return methods;
}
