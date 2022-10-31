import { ValueTreeNode } from "../../types/ast/node";
import { MathOperationNode } from "../../types/ast/nodes/mathOperation";
import { TokenRange, validOperators } from "../../types/token";

// pemdas smile
const operationOrder: (typeof validOperators)[number][] = ["*", "/", "+", "-"]

export function flattenTree(tree: ValueTreeNode): (ValueTreeNode | (typeof validOperators)[number])[] {
  switch (tree.type) {
    case "mathOperation": return [...flattenTree(tree.getLeftHand()), tree.getOperation(), ...flattenTree(tree.getRightHand())];
    // why the __fuck__ are you using PEMDAS against a comparison
    default:
      return [ tree ];
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
    return new MathOperationNode(new TokenRange(operationArray[0].getTokenRange().getStart(), operationArray[2].getTokenRange().getEnd()), operationArray[0], operationArray[1], operationArray[2])
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

      return new MathOperationNode(new TokenRange(leftHand.getTokenRange().getStart(), rightHand.getTokenRange().getEnd()), leftHand, operation, rightHand);
    }
  }

  throw new Error("Operation goes brrr");
}