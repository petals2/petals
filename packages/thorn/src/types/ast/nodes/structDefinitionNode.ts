import { LexReader } from "../../reader/lexReader";
import { TokenRange, TokenType } from "../../token";
import { StructureType } from "../type";

export class StructDefinitionNode {
  type = <const>"structDefinitionNode";

  constructor(
    protected readonly tokenRange: TokenRange,
    protected readonly name: string,
    protected readonly structure: StructureType,
  ) { }

  getTokenRange() {
    return this.tokenRange;
  }

  getName() { return this.name }
  getStructure() { return this.structure }

  static build(reader: LexReader) {
    const structToken = reader.expect({ type: TokenType.Keyword, value: "struct" });

    const nameToken = reader.expect({ type: TokenType.Identifier });

    const contents = reader.readBetween("{");
    const structure = StructureType.build(contents);

    return new StructDefinitionNode(new TokenRange(structToken, contents.getRange().getEnd()), nameToken.value, structure);
  }
}