import { TreeNode } from "../../../types/ast/node";
import { PropertyReferenceNode } from "../../../types/ast/nodes/propertyReference";
import { VariableReferenceNode } from "../../../types/ast/nodes/variableReference";
import { Context } from "../context";
import { getType } from "../getType";

export function getReferencedMethods(context: Context, ...codeBlock: TreeNode[]): string[] {
  const methods: string[] = [];

  context.enter();

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
          if (node.getBaseValue().type === "propertyReference") {
            const pr = node.getBaseValue() as PropertyReferenceNode;
            const bt = getType(pr.getParent(), context);

            if (bt.isClassType()) {
              methods.push("___" + bt.getName() + "_" + pr.getProperty());
              break;
            }
          }

          const t = getType(node.getBaseValue(), context);

          if (t.isSelfType()) {
            methods.push("______self_" + node.getBaseValue());
            break;
          }

          if (!(t as any).isStructureType() && !(t as any).isReferenceType()) {
            throw new Error("Method call base must be variable reference or of class type");
          }

          methods.push("___" + (t as any).getName() + "_" + node.getBaseValue());
          break;
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
          context.createVariable(node.getName(), 0, node.getType() ?? getType(node.getInitialValue()!, context));
          methods.push(...getReferencedMethods(context, node.getInitialValue()!));
        } else {
          if (!node.getType())
            throw new Error("Failure to infer type");

          context.createVariable(node.getName(), 0, node.getType()!);
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

  context.exit();

  return methods;
}