import { Node, ValueNode } from ".";
import { SafeUnexpectedTokenError } from "../../errors/unexpectedToken";
import { LexReader } from "../../lexer/lexReader";
import { TokenRange, TokenType } from "../../lexer/token";

export class ImportNode extends Node {
  constructor(
    range: TokenRange,
    protected readonly imports: string | string[],
    protected readonly from: string,
  ) {
    super(range)
  }

  getImports() { return this.imports }
  getSource() { return this.from }

  static build(reader: LexReader): ImportNode {
    reader.openRange();

    reader.expect({ type: TokenType.Keyword, value: "import" });

    let imports: string | string[];

    if (reader.nextIs({ type: TokenType.Separator, value: "{" })) {
      imports = [];

      const contents = reader.readBetween("{");

      while (!contents.isComplete()) {
        imports.push(contents.expect({ type: TokenType.Identifier }).value);

        if (contents.isComplete()) break;

        contents.expect({ type: TokenType.Separator, value: "," });
      }
    } else {
      imports = reader.expect({ type: TokenType.Identifier }).value;
    }

    reader.expect({ type: TokenType.Keyword, value: "from" });

    const from = reader.expect({ type: TokenType.StringLiteral }).value;

    if (!reader.nextIs({ type: TokenType.Separator, value: ";" })) {
      const token = reader.peek();

      reader.pushLexError(new SafeUnexpectedTokenError(`Expected Separator<";">`, token, TokenRange.fromArray(reader.getFile(), [token])))
    } else {
      reader.read();
    }

    return new ImportNode(reader.closeRange(), imports, from);
  }
}
