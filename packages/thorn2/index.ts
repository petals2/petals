import { StringReader } from "petals-utils";
import { lex } from "./src/lexer";
import fs from "fs";
import { buildAst } from "./src/ast";
import util from "util"
import { ThornProject } from "./src/thornProject";
import path from "path";

// const lexFile = lex(new StringReader(fs.readFileSync("./example/index.tn", "utf-8")));
// const ast = buildAst(lexFile);

// console.log(util.inspect(ast, false, Infinity));

const project = new ThornProject(path.resolve("./example/"));

const scratchProject = project.translateIntoScratchProject();

console.log(scratchProject);

(async () => {
  fs.writeFileSync("./proj.sb3", await scratchProject.toSb3());
})();
