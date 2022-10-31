const fs = require("fs");
const path = require("path");

const packageLoc = process.argv[2];

if (!packageLoc)
  throw new Error("Missing package location to fix");

const allFileRenames = new Map;
const allOpenedFileImports = new Map;

function getAllOpenFilesWithImport(importPath) {
  const filesWithImport = [];
  if (importPath.endsWith("/index.ts")) {
    importPath = importPath.substring(importPath, importPath.length - 9);
  }

  for (const [ filePath, allImports ] of allOpenedFileImports) {
    const relativePath = path.relative(filePath, importPath);
    
    for (const importStr of allImports) {
      if (path.relative(importStr, relativePath) === "") {
        filesWithImport.push([ filePath, importStr ]);
      }
    }
  }

  return filesWithImport;
}

function renameFile(srcFilePath, dstFilePath) {
  fs.renameSync(srcFilePath, dstFilePath);
  allFileRenames.set(srcFilePath, dstFilePath);

  const filesWithImport = getAllOpenFilesWithImport(srcFilePath);
  for (const [ filePath, importStr ] of filesWithImport) {
    const fileData = fs.readFileSync(filePath, "utf8");
    fs.writeFileSync(filePath, fileData.replace("from \"" + importStr + "\"", "from \"" + path.relative(filePath, dstFilePath) + "\""));
  }
}

function updateFileImports(filePath) {
  let fileData = fs.readFileSync(filePath, "utf8");
  const allImportLines = fileData.match(/import .+ from "(.+)"/g) || [];

  for (const importLine of allImportLines) {
    const str = importLine.match(/"(.+)"/)[1];

    for (const [ srcFilePath, dstFilePath ] of allFileRenames) {
      const relativePath = path.relative(filePath, srcFilePath);
      
      if (path.relative(relativePath, str) === "") {
        fileData = fileData.replace(str, path.relative(filePath, dstFilePath));
      }
    }
  }
}

function recursiveFixDirectory(baseDir, directoryName) {
  const absoluteDir = path.resolve(baseDir, directoryName);
  const filesInDirectory = fs.readdirSync(absoluteDir);

  const idx = filesInDirectory.indexOf("index.ts");
  if (idx > -1) {
    let filePath = path.resolve(absoluteDir, "index.ts");
    const indexTsContents = fs.readFileSync(filePath, "utf8");

    if (!indexTsContents.startsWith("export * from ")) {
      const fileClassName = directoryName.endsWith("s") ? directoryName.substring(0, directoryName.length - 1) : directoryName;
      const newFilePath = path.resolve(absoluteDir, fileClassName + ".ts");
      renameFile(filePath, newFilePath);
      filePath = newFilePath;
      filesInDirectory[idx] = fileClassName + ".ts";
    }

    updateFileImports(filePath);
  }

  const allExportLines = [];
  for (const fileInDir of filesInDirectory) {
    const filePath = path.resolve(absoluteDir, fileInDir);
    const fileStat = fs.statSync(filePath);

    if (fileInDir === "index.ts") {
      continue;
    }
    
    if (fileStat.isDirectory()) {
      allExportLines.push("export * from \"./" + path.basename(fileInDir, ".ts") + "\";");
      continue;
    }
    
    const fileData = fs.readFileSync(filePath);
    if (fileData.includes("export ")) {
      allExportLines.push("export * from \"./" + path.basename(fileInDir, ".ts") + "\";");
    }
  }
  
  fs.writeFileSync(path.resolve(absoluteDir, "index.ts"), allExportLines.join("\n"), "utf8");

  for (const file of filesInDirectory) {
    if (file === "index.ts") {
      continue;
    }

    const filePath = path.resolve(absoluteDir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      recursiveFixDirectory(absoluteDir, file);
      continue;
    }

    updateFileImports(filePath);
  }
}

const startDate = Date.now();
recursiveFixDirectory(path.resolve(process.cwd(), packageLoc), "src");
const endDate = Date.now();
const tookMs = endDate - startDate;

console.log("Took %sms to fix exports for %s", tookMs, packageLoc);
