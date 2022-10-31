import { ImportNode } from "../ast/node/import";
import { StringReader } from "petals-utils";
import { buildAst } from "../ast";
import { lex } from "../lexer";
import path from "path";
import fs from "fs";
import { Sprite, Stage } from "petals-stem";
import { TreeNode } from "../ast/node";
import { FunctionDefinitionNode } from "../ast/node/functionDefinition";
import { TranslationContext } from "../translate/context";
import { ThornFunctionRefrence } from "../refrences/thorn/function";
import { VariableDefinitionNode } from "../ast/node/variableDefinition";
import { ThornVariableRefrence } from "../refrences/thorn/variable";
import { translateStack } from "../translate";
import { Events } from "petals-stem/dist/src/block";

export class File {
  protected imports: { imports: string[] | string, file: File }[];
  protected ast: TreeNode[];

  constructor(file: string) {
    const lexReader = lex(file, new StringReader(fs.readFileSync(file, "utf-8")));
    this.ast = buildAst(file, lexReader);

    this.imports = this.ast.filter(node => node instanceof ImportNode).map(node => {
      const importNode = node as ImportNode;

      return {
        imports: importNode.getImports(),
        file: new File(path.join(file, "..", importNode.getSource())),
      };
    });
  }

  translateIntoTarget(target: Sprite | Stage, context: TranslationContext): void {
    this.imports.forEach(i => i.file.translateIntoTarget(target, context));

    context.setTarget(target)
    target.getBlocks().createBlock(Events.WhenFlagClicked).append(translateStack(this.ast, context));
    context.clearTarget();
  }
}
