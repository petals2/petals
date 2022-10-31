import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { buildAst, readNode } from "../../../routines/buildAst";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { TreeNode, ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class ifBlockNode {
  type = <const>"ifBlock";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly comparison: ValueTreeNode,
    protected readonly contents: TreeNode[],
    protected readonly elseContents: TreeNode[] | undefined,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getComparison() { return this.comparison }
  getContents() { return this.contents }
  getElseContents() { return this.elseContents }

  static build(reader: LexReader): ifBlockNode {
    const ifToken = reader.expect({ type: TokenType.Keyword, value: "if" });
    const comparison = readValue(reader);
    
    if (comparison instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(comparison));
    }

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      const contentsReader = reader.readBetween("{");
      const contents = buildAst(contentsReader);
      let elseReader: LexReader | undefined = undefined;
      let elseContents: TreeNode[] | undefined = undefined;

      if (reader.nextIs({ type: TokenType.Keyword, value: "else" })) {
        reader.read();

        elseReader = reader.readBetween("{");
        elseContents = buildAst(elseReader);
      }

      const bodyRange = elseReader ? new TokenRange(elseReader.getRange()) : new TokenRange(contentsReader.getRange());
      return new ifBlockNode(new TokenRange(ifToken, bodyRange.getEnd()), comparison, contents, elseContents)
    }

    const trueCase = [ readNode(reader) ];
    let elseCase: TreeNode[] | undefined = undefined;

    if (reader.nextIs({ type: TokenType.Keyword, value: "else" })) {
      reader.read();

      if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
        elseCase = buildAst(reader.readBetween("{"));
      } else {
        elseCase = [ readNode(reader) ];
      }
    }
    
    const bodyRange = elseCase ? TokenRange.fromNodes(elseCase) : TokenRange.fromNodes(trueCase);

    return new ifBlockNode(new TokenRange(ifToken, bodyRange.getEnd()), comparison, trueCase, elseCase);
  }
}