import { buildAst } from "../../../routines/buildAst";
import { LexReader } from "../../reader/lexReader";
import { Token, TokenRange, TokenType } from "../../token";
import { Type, VoidType } from "../type";
import { MethodDefinitionNode } from "./methodDefinition";

export class ClassDefinitionNode {
  type = <const>"classDefinitionNode";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly name: string,
    protected readonly fields: Record<string, { publicity: "public" | "protected" | "private", readonly: boolean, type: Type }>,
    protected readonly methods: Record<string, { publicity: "public" | "protected" | "private", method: MethodDefinitionNode }>,
    protected readonly ctor: { publicity: "public" | "protected" | "private", method: MethodDefinitionNode } | undefined,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getName() { return this.name }
  getFields() { return this.fields }
  getMethods() { return this.methods }
  getConstructor() { return this.ctor }

  static build(reader: LexReader): ClassDefinitionNode {
    const classToken = reader.expect({ type: TokenType.Keyword, value: "class" });

    const nameToken = reader.expect({ type: TokenType.Identifier });
    const contents = reader.readBetween("{");

    const fields: Record<string, { publicity: "public" | "protected" | "private", readonly: boolean, type: Type }> = {};
    const methods: Record<string, { publicity: "public" | "protected" | "private", method: MethodDefinitionNode }> = {};
    let ctor: { publicity: "public" | "protected" | "private", method: MethodDefinitionNode } | undefined;

    while (!contents.isComplete()) {
      let propertyStartToken: Token|undefined = undefined;
      let publicity: "public" | "protected" | "private" = "public";

      if (contents.nextIs({ type: TokenType.Keyword, value: "public" }, { type: TokenType.Keyword, value: "protected" }, { type: TokenType.Keyword, value: "private" })) {
        const token = contents.expect({ type: TokenType.Keyword, value: "public" }, { type: TokenType.Keyword, value: "protected" }, { type: TokenType.Keyword, value: "private" });
        publicity = token.value;
        if (!propertyStartToken) propertyStartToken = token;
      }

      if (contents.nextIs({ type: TokenType.Keyword, value: "readonly" })) {
        const token = contents.expect({ type: TokenType.Keyword, value: "readonly" });
        if (!propertyStartToken) propertyStartToken = token;

        const name = contents.expect({ type: TokenType.Identifier }).value;

        contents.expect({ type: TokenType.Separator, value: ":" });

        const type = Type.build(contents);

        fields[name] = { publicity, readonly: true, type };

        if (contents.nextIs({ type: TokenType.Separator, value: ";" })) contents.read();

        continue;
      }

      const nameToken = contents.expect({ type: TokenType.Identifier }, { type: TokenType.Keyword, value: "constructor" });

      if (contents.nextIs({ type: TokenType.Separator, value: "(" })) {
        if (!propertyStartToken) propertyStartToken = nameToken;
        // we know this is a method.
        const argReader = contents.readBetween("(");

        let returnType: Type | undefined;

        if (nameToken.value !== "constructor") {
          contents.expect({ type: TokenType.Separator, value: ":" });
  
          returnType = Type.build(contents);
        }

        const contents2Reader = contents.readBetween("{");
        const contents2 = buildAst(contents2Reader);

        const args: { name: string, type: Type }[] = [];

        while (!argReader.isComplete()) {
          const name = argReader.expect({ type: TokenType.Identifier }).value;

          argReader.expect({ type: TokenType.Separator, value: ":" });

          const type = Type.build(argReader);

          args.push({ name, type });

          if (argReader.nextIs({ type: TokenType.Separator, value: "," })) argReader.read();
        }

        const method = new MethodDefinitionNode(new TokenRange(propertyStartToken, contents2Reader.getRange().getEnd()), nameToken.value, returnType ?? new VoidType(), args, contents2);

        if (contents.nextIs({ type: TokenType.Separator, value: ";" })) contents.read();

        if (nameToken.value === "constructor") {
          ctor = { publicity, method };
          continue;
        }

        methods[nameToken.value] = { publicity, method };
        continue;
      }

      if (nameToken.value === "constructor") {
        throw new Error("Cannot call a class field \"constructor\"");
      }

      contents.expect({ type: TokenType.Separator, value: ":" });

      const type = Type.build(contents);

      fields[nameToken.value] = { publicity, readonly: false, type };

      if (contents.nextIs({ type: TokenType.Separator, value: ";" })) contents.read();
    }

    return new ClassDefinitionNode(new TokenRange(classToken, contents.getRange().getEnd()), nameToken.value, fields, methods, ctor);
  }
}