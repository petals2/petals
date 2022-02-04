import { StringReader } from "petals-utils";
import { Token, TokenType, validComparators, validKeywords, validOperators, validSeparators } from "../../types/token";

export function readToken(reader: StringReader): Token | undefined {
  reader.readUntilNot(" ", "\n", "\t", "\r");

  const booleanCheck = reader.nextIsOne("true", "false");
  if (booleanCheck) {
    return {
      type: TokenType.BooleanLiteral,
      value: reader.expect(booleanCheck) === "true",
    }
  }

  const commentCheck = reader.nextIsOne("//", "/*");

  if (commentCheck == "//") {
    return {
      type: TokenType.Comment,
      value: reader.readUntil("\n", "\r"),
    };
  } else if (commentCheck == "/*") {
    return {
      type: TokenType.Comment,
      value: reader.readUntil("*/"),
    };
  }

  const possibleKeyword = reader.nextIsOne(...validKeywords);

  if (possibleKeyword) {
    return {
      type: TokenType.Keyword,
      value: reader.expect(possibleKeyword),
    };
  }

  const comparator = reader.nextIsOne(...validComparators);

  if (comparator) {
    return {
      type: TokenType.Comparison,
      value: reader.expect(comparator),
    }
  }

  const operator = reader.nextIsOne(...validOperators);

  if (operator) {
    return {
      type: TokenType.Operator,
      value: reader.expect(operator),
    };
  }

  const separator = reader.nextIsOne(...validSeparators);

  if (separator) {
    const res = reader.expect(separator);

    const isNumber = reader.nextIsOne("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".");
    if (separator === "." && isNumber) {
      return {
        type: TokenType.NumberLiteral,
        value: parseFloat(`0.${reader.readUntilNot("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".")}`)
      };
    }

    return {
      type: TokenType.Separator,
      value: res,
    }
  }

  const isNumber = reader.readUntilNot("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".");

  if (isNumber.length > 0) {
    return {
      type: TokenType.NumberLiteral,
      value: parseFloat(isNumber),
    }
  }

  const stringStartingCharacter = reader.nextIsOne("'", '"');

  if (stringStartingCharacter) {
    reader.expect(stringStartingCharacter);

    const contents = reader.readUntil(stringStartingCharacter);

    reader.expect(stringStartingCharacter);

    return {
      type: TokenType.StringLiteral,
      value: contents,
    }
  }

  const identifier = reader.readUntil(" ", "\n", "\t", "\r", ...validSeparators, ...validOperators);

  if (identifier.length > 0) {
    return {
      type: TokenType.Identifier,
      value: identifier,
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
