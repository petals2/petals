import { ThornSprite } from ".";
import path from "path";
import fs from "fs";

function dirWalkToFindSprites(directory: string): string[] {
  let strings: string[] = [];

  fs.readdirSync(directory).forEach(file => {
    const currentPath = path.join(directory, file);

    if (fs.existsSync(path.join(currentPath, "sprite.json"))) {
      strings.push(currentPath);
      return;
    }

    if (fs.statSync(currentPath).isDirectory()) {
      strings.push(...dirWalkToFindSprites(currentPath));
    }
  })

  return strings;
}

export function loadSprites(directory: string): ThornSprite[] {
  return dirWalkToFindSprites(directory).map(path => new ThornSprite(path))
}
