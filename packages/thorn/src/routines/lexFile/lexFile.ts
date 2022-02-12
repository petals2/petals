import { StringReader } from "petals-utils";
import { Token, TokenType, validComparators, validKeywords, validOperators, validSeparators } from "../../types/token";

export function readToken(reader: StringReader): Token | undefined {
  reader.readUntilNot(" ", "\n", "\t", "\r");

  const booleanCheck = reader.nextIsOne("true", "false");
  if (booleanCheck) {
    const boolStr = reader.expect(booleanCheck);
    return {
      type: TokenType.BooleanLiteral,
      value: boolStr.value === "true",
      startPos: boolStr.startPos,
      endPos: boolStr.endPos
    }
  }

  const commentCheck = reader.nextIsOne("//", "/*");

  if (commentCheck == "//") {
    return {
      type: TokenType.Comment,
      ...reader.readUntil("\n", "\r")
    };
  } else if (commentCheck == "/*") {
    return {
      type: TokenType.Comment,
      ...reader.readUntil("*/")
    };
  }

  const possibleKeyword = reader.nextIsOne(...validKeywords);

  if (possibleKeyword) {
    return {
      type: TokenType.Keyword,
      ...reader.expect(possibleKeyword),
    };
  }

  const comparator = reader.nextIsOne(...validComparators);

  if (comparator) {
    return {
      type: TokenType.Comparison,
      ...reader.expect(comparator),
    }
  }

  const separator = reader.nextIsOne(...validSeparators);

  if (separator) {
    const res = reader.expect(separator);

    const isNumber = reader.nextIsOne("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".");
    if (separator === "." && isNumber) {
      const floatStr = reader.readUntilNot("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".");
      return {
        type: TokenType.NumberLiteral,
        value: parseFloat(`0.${floatStr}`),
        startPos: floatStr.startPos,
        endPos: floatStr.endPos
      };
    }

    return {
      type: TokenType.Separator,
      ...res,
    }
  }

  const operator = reader.nextIsOne(...validOperators);

  if (operator) {
    return {
      type: TokenType.Operator,
      ...reader.expect(operator),
    };
  }

  const isNumber = reader.readUntilNot("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".");

  if (isNumber.value.length > 0) {
    return {
      type: TokenType.NumberLiteral,
      value: parseFloat(isNumber.value),
      startPos: isNumber.startPos,
      endPos: isNumber.endPos
    }
  }

  const stringStartingCharacter = reader.nextIsOne("'", '"');

  if (stringStartingCharacter) {
    reader.expect(stringStartingCharacter);

    const contents = reader.readUntil(stringStartingCharacter);

    reader.expect(stringStartingCharacter);

    return {
      type: TokenType.StringLiteral,
      ...contents
    }
  }

  const identifier = reader.readUntil(" ", "\n", "\t", "\r", ...validSeparators, ...validOperators);

  if (identifier.value.length > 0) {
    return {
      type: TokenType.Identifier,
      ...identifier
    }
  }

  return undefined;
}

export function lex(reader: StringReader): Token[] {
  const tokens: Token[] = [];

  while(!reader.isComplete()) {
    const t = readToken(reader);

    if (t) {
      tokens.push(t);
    }
  }

  return tokens;
}
