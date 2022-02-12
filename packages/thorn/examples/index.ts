import { ScrProject } from "../src/types/scratchProject";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import { TextRenderer } from "petals-render/dist/renderers/text";
import { Project } from "../src/types/project";
import { AstFile } from "../src/types/file/astFile";
import { ThornError } from "../src/errors/thornError";

const [ windowCols, windowRows ] = process.stdout.getWindowSize();

const start = Date.now();
const project = ScrProject.fromManifestPath(path.resolve(__dirname, "package.silo"));
const end = Date.now();

// console.log(util.inspect(project.petals.serialize().targets[0].blocks, false, Infinity, true));

const stage = project.petals.getTargets().getStage();

function countProjectErrors(project: Project<any>) {
  let numErrors = 0;
  const files = project.getFileErrors();
  for (const [ filePath, errors ] of files) {
    numErrors += errors.length;
  }
  return numErrors;
}

function countErrors(projects: Project<any>[]) {
  let numErrors = 0;
  for (const project of projects) {
    numErrors += countProjectErrors(project);
  }
  return numErrors;
}

function centeredText(text: string, windowCols: number) {
  const space = windowCols - text.length;
  const left = Math.floor(space / 2);
  const right = Math.ceil(space / 2);

  return " ".repeat(left) + text + " ".repeat(right);
}

function getFileLineAndColumn(fileData: string, position: number) {
  let lineBeginPos = position;
  if (fileData[lineBeginPos] === "\n" && fileData[lineBeginPos - 1] === "\n") {
    let lineIdx = 1;
    for (let i = 0; i < lineBeginPos; i++) {
        if (fileData[i] === "\n") {
            lineIdx++;
        }
    }
    return { line: lineIdx, column: position - lineBeginPos + 1, lineBeginPos, lineEndPos: lineBeginPos };
  }
  while (fileData[lineBeginPos - 1] !== "\n" && lineBeginPos > 0) {
      lineBeginPos--;
  }
  let lineIdx = 1;
  for (let i = 0; i < lineBeginPos; i++) {
      if (fileData[i] === "\n") {
          lineIdx++;
      }
  }
  let lineEndPos = position;
  if (fileData[lineEndPos] === "\n") {
    return { line: lineIdx, column: position - lineBeginPos + 1, lineBeginPos, lineEndPos };
  }

  while (fileData[lineEndPos + 1] !== "\n" && lineEndPos < fileData.length) {
      lineEndPos++;
  }

  return { line: lineIdx, column: position - lineBeginPos + 1, lineBeginPos, lineEndPos };
}

function printFileErrors(filePath: string, errors: ThornError[]) {
  const fileData = fs.readFileSync(filePath, "utf8");
  
  const fileText = " ./" + path.relative(process.cwd(), filePath).replace("\\", "/");
  const errorsText = "(" + errors.length + " " + (errors.length === 1 ? "error" : "errors") + ")";

  const bannerText = fileText + " " + errorsText;

  console.log(chalk.bgWhite.black(fileText + " " + chalk.red(errorsText) + " ".repeat(windowCols - bannerText.length)) + "\n");

  for (let i = 0; i < errors.length; i++) {
    const error = errors[i];
    const formattedSummary = (error.fatal
      ? chalk.bgHex("#5b0f00")(chalk.hex("#e69138")("F" + error.errorCode.toString().padStart(3, "0")) + " - FATAL")
      : chalk.hex("#e69138")("E" + error.errorCode.toString().padStart(3, "0"))) + " " + chalk.white("- " + error.getSummary());;
    console.log("    " + chalk.red((i + 1) + ". ") + " " + formattedSummary);
    const [ start, end ] = error.getFilePositionRange();
    const { line: startLine, column: startColumn, lineBeginPos: startLineBeginPos, lineEndPos: startLineEndPos } = getFileLineAndColumn(fileData, start);
    const { line: endLine, column: endColumn, lineBeginPos: endLineBeginPos, lineEndPos: endLineEndPos } = getFileLineAndColumn(fileData, end);

    // console.log(chalk.grey(startLine + ":" + startColumn + (endLine !== startLine ? "-" + endLine + ":" + (endColumn + 1) : (endColumn + 1) !== startColumn ? "-" + (endColumn + 1) : "") + " " + filePath));
    // console.log(chalk.grey(startLine + ":" + startColumn + (endLine !== startLine ? "-" + endLine + ":" + (endColumn + 1) : (endColumn + 1) !== startColumn ? "-" + (endColumn + 1) : "")));

    const { lineBeginPos: contextLineBeginPos, lineEndPos: contextLineEndPos } = getFileLineAndColumn(fileData, startLineBeginPos - 1); 

    const contextPart = fileData.substring(contextLineBeginPos, contextLineEndPos);
    const firstPart = fileData.substring(startLineBeginPos, start);
    const errorPart = fileData.substring(start, end + 1);
    const lastPart = fileData.substring(end + 1, endLineEndPos + 1);

    const full = firstPart + chalk.bgRed.white(errorPart) + lastPart;
    const lines = full.split("\n");

    if (startLine > 1) {
      console.log(chalk.grey((startLine - 1).toString().padStart(7, " ") + " " + chalk.grey(contextPart)));
    }
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      console.log(chalk.grey((startLine + i).toString().padStart(7, " ") + " " + chalk.grey(line)));
      if (i === lines.length - 1) {
        const errorPartLines = errorPart.split("\n");
        const lastErrorPartLine = errorPartLines[errorPartLines.length - 1];
        console.log("       " + chalk.grey(" ".repeat(endColumn - lastErrorPartLine.length + 1) + "^ " + error.getMessage()));
      }
    }
    console.log("");
  }
}

function printTargetProjectErrors(project: Project<AstFile>) {
  const allFileErrors = project.getFileErrors();

  if (allFileErrors.size === 0)
    return;

  const numErrors = countProjectErrors(project);

  // const targetText = "Target: " + project.getManifest().name;
  // const errorsText = "(" + numErrors + " " + (numErrors === 1 ? "error" : "errors") + ")";

  // const bannerText = targetText + " " + errorsText;

  // console.log(chalk.bgWhite.black(targetText + " " + chalk.red(errorsText) + " ".repeat(windowCols - bannerText.length)) + "\n");

  for (const [ filePath, fileErrors ] of allFileErrors) {
    printFileErrors(filePath, fileErrors);
  }
}

(async () => {
  const sb3 = await project.petals.toSb3();

  fs.writeFileSync(path.resolve(__dirname, "out.sb3"), sb3);
  
  for (let head of stage.getBlocks().getAllBlockHeads()) {
    const renderer = new TextRenderer("English")
  
    console.log(renderer.renderStack(head, false));
  }
  
  const allProjects = [ project.stageProject, ...project.spriteProjects ];
  const numErrors = countErrors(allProjects);

  if (numErrors > 0) {
    const errsText = numErrors + (numErrors === 1 ? " Error" : " Errors");
    console.log(chalk.bgRed(centeredText(errsText, windowCols)) + "\n");
  
    for (const project of allProjects) {
      printTargetProjectErrors(project);
    }
  }

  console.log(path.resolve(__dirname, "out.sb3"));
  console.log("Took " + (end - start) + "ms to compile thorn project");
})();

