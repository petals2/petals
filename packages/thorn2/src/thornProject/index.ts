import fs from "fs";
import path from "path";
import { Costume, Project, Vector2 } from "petals-stem";
import { File } from "../file";
import { TranslationContext } from "../translate/context";
import { loadSprites } from "./loadSprites";

interface ThornProjectJson {
  name?: string,
  index?: string,
  scratchId?: number,
}

export class ThornProject {
  projectJson: ThornProjectJson;
  children: ThornProject[];
  indexFile: File;

  constructor(protected readonly rootDirectory: string, projectJsonName = "project.json") {
    const projectJsonPath = path.join(rootDirectory, projectJsonName);

    if (!fs.existsSync(projectJsonPath)) {
      throw new Error("Missing " + projectJsonName);
    }

    const projectJsonString = fs.readFileSync(projectJsonPath, "utf-8");
    this.projectJson = JSON.parse(projectJsonString);
    this.children = loadSprites(rootDirectory);
    this.indexFile = new File(path.join(rootDirectory, this.getIndexRaw() ?? "index.tn"))
  }

  getName() {
    if (this.projectJson.name === undefined) {
      throw new Error("Missing name in project.json");
    }

    return this.projectJson.name;
  }

  getNameRaw() { return this.projectJson.name }
  getIndex() { return this.indexFile }
  getIndexRaw() { return this.projectJson.index }
  getScratchId() { return this.projectJson.scratchId }
  getScratchIdRaw() { return this.projectJson.scratchId }

  getChildren(): ThornProject[] { return this.children }

  translateIntoScratchProject(): Project {
    const project = new Project("Thorn", "3.0.0-Petals", "3.0.0");
    const stage = project.getTargets().getStage();

    stage.getCostumes().addCostume(new Costume("example", "svg", Buffer.from(""), new Vector2(0, 0)));

    const ctx = new TranslationContext(project);

    this.indexFile.translateIntoTarget(stage, ctx);

    return project;
  }
}

export class ThornSprite extends ThornProject {
  constructor(protected readonly rootDirectory: string) {
    super(rootDirectory, "sprite.json")
  }
}

