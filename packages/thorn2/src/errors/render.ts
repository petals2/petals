import { ThornError } from "./thornError";
import chalk from "chalk";
import path from "path";
import fs from "fs";

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

export function render(error: ThornError): never {
  const [windowCols, windowRows] = process.stdout.getWindowSize();

  const fileData = fs.readFileSync(error.file, "utf8");

  const fileText = " ./" + path.relative(process.cwd(), error.file).replace("\\", "/");

  const bannerText = fileText// + " " + errorsText;

  console.log(chalk.bgWhite.black(fileText/* + " " + chalk.red(errorsText)*/ + " ".repeat(windowCols - bannerText.length)) + "\n");

  const formattedSummary = (error.fatal
    ? chalk.bgHex("#5b0f00")(chalk.hex("#e69138")("F" + error.errorCode.toString().padStart(3, "0")) + " - FATAL")
    : chalk.hex("#e69138")("E" + error.errorCode.toString().padStart(3, "0"))) + " " + chalk.white("- " + error.getSummary());;
  console.log("    " + /* chalk.red((i + 1) + ". ") + " " + */ formattedSummary);
  const [start, end] = error.getFilePositionRange();
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

  process.exit();
}
