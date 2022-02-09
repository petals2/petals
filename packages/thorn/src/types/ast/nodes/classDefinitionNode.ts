import { MethodDefinitionNode } from "./methodDefinition";
import { Type, VoidType } from "../type";
import { LexReader } from "../../reader/lexReader";
import { TokenType } from "../../token";
import { buildAst } from "../../../routines/buildAst";

export class ClassDefinitionNode {
  type = <const>"classDefinitionNode";

  constructor(
    protected readonly name: string,
    protected readonly fields: Record<string, { publicity: "public" | "protected" | "private", readonly: boolean, type: Type }>,
    protected readonly methods: Record<string, { publicity: "public" | "protected" | "private", method: MethodDefinitionNode }>,
    protected readonly ctor: { publicity: "public" | "protected" | "private", method: MethodDefinitionNode } | undefined,
  ) { }

  getName() { return this.name }
  getFields() { return this.fields }
  getMethods() { return this.methods }
  getConstructor() { return this.ctor }

  static build(reader: LexReader): ClassDefinitionNode {
    reader.expect({ type: TokenType.Keyword, value: "class" });

    const name = reader.expect({ type: TokenType.Identifier }).value;
    const contents = reader.readBetween("{");

    const fields: Record<string, { publicity: "public" | "protected" | "private", readonly: boolean, type: Type }> = {};
    const methods: Record<string, { publicity: "public" | "protected" | "private", method: MethodDefinitionNode }> = {};
    let ctor: { publicity: "public" | "protected" | "private", method: MethodDefinitionNode } | undefined;

    while (!contents.isComplete()) {
      let publicity: "public" | "protected" | "private" = "public";

      if (contents.nextIs({ type: TokenType.Keyword, value: "public" }, { type: TokenType.Keyword, value: "protected" }, { type: TokenType.Keyword, value: "private" })) {
        publicity = contents.expect({ type: TokenType.Keyword, value: "public" }, { type: TokenType.Keyword, value: "protected" }, { type: TokenType.Keyword, value: "private" }).value;
      }

      if (contents.nextIs({ type: TokenType.Keyword, value: "readonly" })) {
        contents.expect({ type: TokenType.Keyword, value: "readonly" });

        // we know this is a field.
        const name = contents.expect({ type: TokenType.Identifier }).value;

        contents.expect({ type: TokenType.Separator, value: ":" });

        const type = Type.build(contents);

        fields[name] = { publicity, readonly: true, type };

        if (contents.nextIs({ type: TokenType.Separator, value: ";" })) contents.read();

        continue;
      }

      const name = contents.expect({ type: TokenType.Identifier }, { type: TokenType.Keyword, value: "constructor" }).value;

      if (contents.nextIs({ type: TokenType.Separator, value: "(" })) {
        // we know this is a method.
        const argReader = contents.readBetween("(");

        let returnType: Type | undefined;

        if (name !== "constructor") {
          contents.expect({ type: TokenType.Separator, value: ":" });
  
          returnType = Type.build(contents);
        }

        const contents2 = buildAst(contents.readBetween("{"));

        const args: { name: string, type: Type }[] = [];

        while (!argReader.isComplete()) {
          const name = argReader.expect({ type: TokenType.Identifier }).value;

          argReader.expect({ type: TokenType.Separator, value: ":" });

          const type = Type.build(argReader);

          args.push({ name, type });

          if (argReader.nextIs({ type: TokenType.Separator, value: "," })) argReader.read();
        }

        const method = new MethodDefinitionNode(name, returnType ?? new VoidType(), args, contents2);

        if (contents.nextIs({ type: TokenType.Separator, value: ";" })) contents.read();

        if (name === "constructor") {
          ctor = { publicity, method };
          continue;
        }

        methods[name] = { publicity, method };
        continue;
      }

      if (name === "constructor") {
        throw new Error("Cannot call a class field \"constructor\"");
      }

      contents.expect({ type: TokenType.Separator, value: ":" });

      const type = Type.build(contents);

      fields[name] = { publicity, readonly: false, type };

      if (contents.nextIs({ type: TokenType.Separator, value: ";" })) contents.read();
    }

    return new ClassDefinitionNode(name, fields, methods, ctor);
  }
}
