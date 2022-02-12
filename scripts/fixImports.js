const fs = require("fs");
const path = require("path");

const packageLoc = process.argv[2];

if (!packageLoc)
  throw new Error("Missing package location to fix");

function getImportPath(importLine) {
  return importLine.match(/"(.+)"/)[1];
}

function getImportedSymbols(importLine) {
  const symbolBraces = importLine.match(/{\s*([\s\S]+?)\s*}/);

  if (!symbolBraces) {
    const symbol = importLine.match(/import ([\s\S]+?) from/)[1];
    return symbol;
  }

  return symbolBraces[1].split(",").map(symbol => symbol.trim());
}

function sortImportFn(a, b) {
  return a.importPath > b.importPath ? 1 : -1;
}

function reconstructImport(importRef) {
  if (Array.isArray(importRef.importedSymbols)) {
    importRef.importedSymbols.sort();
    const symbolLine = importRef.importedSymbols.join(", ");

    if (symbolLine.length >= 60) {
      const symbolLines = "\n  " + importRef.importedSymbols.join(",\n  ") + "\n";
      return "import {" + symbolLines + "} from \"" + importRef.importPath + "\";";
    }

    return "import { " + symbolLine + " } from \"" + importRef.importPath + "\";";
  } else {
    return "import " + importRef.importedSymbols + " from \"" + importRef.importPath + "\";";
  }
}

function collectLikeImports(importRefs) {
  const retImports = new Map;
  const additional = [];
  for (const importRef of importRefs) {
    if (typeof importRef.importedSymbols === "string") {
      additional.push(importRef);
      continue;
    }

    if (importRef.importPath.startsWith("petals-stem"))
      importRef.importPath = "petals-stem";

    const cacheCollectedImport = retImports.get(importRef.importPath);
    const collectedImport = cacheCollectedImport || { importedSymbols: [], importPath: importRef.importPath };
    if (!cacheCollectedImport) {
      retImports.set(importRef.importPath, collectedImport);
    }

    collectedImport.importedSymbols.push(...importRef.importedSymbols);
    collectedImport.importedSymbols = [...new Set(collectedImport.importedSymbols)];
  }

  return [...retImports.values(), ...additional];
}

const petalsStemBlocks = ["Argument", "Control", "Events", "Looks", "Motion", "Operators", "Petals", "Procedures", "Sensing", "Sound", "Variables", "Phantom"];

function recursiveFixDirectory(baseDir, directoryName) {
  const absoluteDir = path.resolve(baseDir, directoryName);
  const filesInDirectory = fs.readdirSync(absoluteDir);

  for (const file of filesInDirectory) {
    const filePath = path.resolve(absoluteDir, file);

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      recursiveFixDirectory(absoluteDir, file);
      continue;
    }

    const fileData = fs.readFileSync(filePath, "utf8");

    const allImportLines = fileData.match(/import [\s\S]+? from "(.+)"/g) || [];

    if (allImportLines.length) {
      let withoutImports = fileData.replace(/import [\s\S]+? from "(.+)";?\n?/g, "").trim();

      const thoseFromPackage = [];
      const thoseFromRel = [];
      for (const importLine of allImportLines) {
        const allImportedSymbols = getImportedSymbols(importLine);

        const allUsedSymbols = Array.isArray(allImportedSymbols)
          ? allImportedSymbols.filter(symbol => symbol.includes(" as ") || withoutImports.includes(symbol))
          : withoutImports.includes(allImportedSymbols) ? allImportedSymbols : undefined;

        if (!allUsedSymbols || allUsedSymbols.length === 0) {
          continue;
        }

        const importPath = getImportPath(importLine);

        if (importPath.startsWith("petals-stem")) {
          if (Array.isArray(allUsedSymbols)) {
            for (let i = 0; i < allUsedSymbols.length; i++) {
              const usedSymbol = allUsedSymbols[i];
              const petalsStemBlocksIdx = petalsStemBlocks.indexOf(usedSymbol);
              if (petalsStemBlocksIdx > -1) {
                withoutImports = withoutImports.replace(new RegExp("(?<!(Blocks\\.)|[a-zA-Z])" + usedSymbol, "g"), "Blocks." + usedSymbol);
                allUsedSymbols[i] = "Blocks";
              }
            }
          }
        }

        if (importPath.startsWith(".")) {
          thoseFromRel.push({ importedSymbols: allUsedSymbols, importPath });
        } else {
          thoseFromPackage.push({ importedSymbols: allUsedSymbols, importPath });
        }
      }
      
      thoseFromPackage.sort(sortImportFn);
      thoseFromRel.sort(sortImportFn);

      const collectedFromPackage = collectLikeImports(thoseFromPackage);
      const collectedFromRel = collectLikeImports(thoseFromRel);
      
      fs.writeFileSync(filePath, ((thoseFromPackage.length > 0 ? collectedFromPackage.map(reconstructImport).join("\n") + "\n\n" : "") + collectedFromRel.map(reconstructImport).join("\n") + "\n\n" + withoutImports).trim());
    }
  }
}

const startDate = Date.now();
recursiveFixDirectory(path.resolve(process.cwd(), packageLoc), "src");
const endDate = Date.now();
const tookMs = endDate - startDate;

console.log("Took %sms to fix imports for %s", tookMs, packageLoc);
