import test from "ava";
import { StringReader } from "petals-utils";
import { lex } from ".";
import { TokenType } from "./token";

test("empty string", t => {
  t.is(lex("", new StringReader("")).isComplete(), true);
})

test("comparators", t => {
  t.is(lex("", new StringReader("<=")).read().type, TokenType.Comparison);
  t.is(lex("", new StringReader("<=")).read().value, "<=");
})

test("separators", t => {
  t.is(lex("", new StringReader("<=")).read().type, TokenType.Separator);
  t.is(lex("", new StringReader("<=")).read().value, "+=");
})

test("operators", t => {
  t.is(lex("", new StringReader("<=")).read().type, TokenType.Operator);
  t.is(lex("", new StringReader("<=")).read().value, "--");
})

test("keywords", t => {
  t.is(lex("", new StringReader("constructor")).read().type, TokenType.Operator);
  t.is(lex("", new StringReader("constructor")).read().value, "constructor");
})

test("keywords", t => {
  t.is(lex("", new StringReader("<=")).read().type, TokenType.Operator);
  t.is(lex("", new StringReader("<=")).read().value, "--");
})
