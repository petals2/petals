import { TreeNode } from "../../types/ast/node";
import { ForNode } from "../../types/ast/nodes/forNode";
import { FreeNode } from "../../types/ast/nodes/freeNode";
import { HeapDefinitionNode } from "../../types/ast/nodes/heapDefinitionNode";
import { ifBlockNode } from "../../types/ast/nodes/ifBlock";
import { MethodDefinitionNode } from "../../types/ast/nodes/methodDefinition";
import { ReturnNode } from "../../types/ast/nodes/return";
import { StructDefinitionNode } from "../../types/ast/nodes/structDefinitionNode";
import { VariableDefinitionNode } from "../../types/ast/nodes/variableDefinition";
import { WhileNode } from "../../types/ast/nodes/while";
import { LexReader } from "../../types/reader/lexReader";
import { TokenType } from "../../types/token";
import { readValue } from "./readValue";

export function buildAst(reader: LexReader): TreeNode[] {
  const nodes: TreeNode[] = [];

  while (!reader.isComplete()) {
    nodes.push(readNode(reader));
  }

  return nodes;
}

export function readNode(reader: LexReader): TreeNode {
  const next = reader.peek();

  if (next.type === TokenType.Keyword) {
    switch(next.value) {
      case "var": return VariableDefinitionNode.build(reader);
      case "if": return ifBlockNode.build(reader);
      case "return": return ReturnNode.build(reader);
      case "while": return WhileNode.build(reader);
      case "for": return ForNode.build(reader);
      case "struct": return StructDefinitionNode.build(reader);
      case "heap": return HeapDefinitionNode.build(reader);
      case "free": return FreeNode.build(reader);
    }
  }

  return readValue(reader);
};
