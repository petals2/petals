import { SelfPassedAsValueError } from "../../../errors/selfPassedAsValue";
import { buildAst, readNode } from "../../../routines/buildAst";
import { readValue } from "../../../routines/buildAst/readValue";
import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { TreeNode, ValueTreeNode } from "../node";
import { SelfReferenceNode } from "./selfReferenceNode";

export class WhileNode {
  type = <const> "while";

  constructor (
    protected readonly tokenRange: TokenRange,
    protected readonly kase: ValueTreeNode,
    protected readonly block: TreeNode[],
  ) {}

  getTokenRange() {
    return this.tokenRange;
  }

  getCase() { return this.kase }
  getBlock() { return this.block }

  static build(reader: LexReader): WhileNode {
    const whileToken = reader.expect({ type: TokenType.Keyword, value: "while" });

    const kase = readValue(reader);
    
    if (kase instanceof SelfReferenceNode) {
      reader.pushLexError(new SelfPassedAsValueError(kase));
    }

    let contents: TreeNode[];

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      contents = buildAst(reader.readBetween("{"));
    } else {
      contents = [readNode(reader)];
    }

    return new WhileNode(new TokenRange(whileToken, TokenRange.fromNodes(contents).getEnd()), kase, contents);
  }
}