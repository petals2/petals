import { ValueTreeNode } from "../../types/ast/node";
import { MathOperationNode } from "../../types/ast/nodes/mathOperation";
import { validOperators } from "../../types/token";

// pemdas smile
const operationOrder: (typeof validOperators)[number][] = ["*", "/", "+", "-"]

export function flattenTree(tree: ValueTreeNode): (ValueTreeNode | (typeof validOperators)[number])[] {
  switch (tree.type) {
    case "mathOperation": return [...flattenTree(tree.getLeftHand()), tree.getOperation(), ...flattenTree(tree.getRightHand())];
    case "parenthesisedExpressionNode": return [tree];
    // why the __fuck__ are you using PEMDAS against a comparison
    case "variableRedefinition": return [tree];
    case "comparisonOperation": return [tree];
    case "propertyReference": return [tree];
    case "variableReference": return [tree];
    case "incrementOperator": return [tree];
    case "decrementOperator": return [tree];
    case "methodDefinition": return [tree];
    case "negateOperator": return [tree];
    case "booleanLiteral": return [tree];
    case "indexReference": return [tree];
    case "stringLiteral": return [tree];
    case "numberLiteral": return [tree];
    case "structLiteral": return [tree];
    case "arrayLiteral": return [tree];
    case "methodCall": return [tree];
    case "heapCopy": return [tree];
  }
}

export function buildPemdas(tree: ValueTreeNode): ValueTreeNode {
  const operationArray = flattenTree(tree);

  return buildPemdasRecursive(operationArray)
}

export function buildPemdasRecursive(operationArray: any[]): ValueTreeNode {
  let largestOperation: number = -1;

  if (operationArray.length === 1) {
    return operationArray[0];
  }

  if (operationArray.length === 3) {
    return new MathOperationNode(operationArray[0], operationArray[1], operationArray[2])
  }

  for (let i = 0; i < operationArray.length - 2; i += 2) {
    const operation = operationArray[i + 1] as any;
    const operationMagnitude = operationOrder.indexOf(operation);

    if (largestOperation < operationMagnitude) {
      largestOperation = operationMagnitude;
    }
  }

  for (let i = 0; i < operationArray.length - 2; i += 2) {
    const operation = operationArray[i + 1] as any;
    const operationMagnitude = operationOrder.indexOf(operation);

    if (operationMagnitude === largestOperation) {
      const leftHand = buildPemdasRecursive(operationArray.slice(0, i + 1));
      const rightHand = buildPemdasRecursive(operationArray.slice(i + 2));

      return new MathOperationNode(leftHand, operation, rightHand);
    }
  }

  throw new Error("Operation goes brrr");
}
