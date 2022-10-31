import { Blocks, Costume, Project as PetalsProject, Sound, Vector2 } from "petals-stem";
import fs from "fs";
import path from "path";

import { ThornError } from "../errors/thornError";
import { Context } from "../routines/translateThroughPetals/context";
import { translateNodeListIntoBlock } from "../routines/translateThroughPetals/translateInto/block";
import { AstFile } from "./file/astFile";
import { Project } from "./project";

export class ScrProject {
  public petals: PetalsProject = new PetalsProject("Thorns (through Petals2)");

  constructor(
    public stageProject: Project<AstFile>,
    public spriteProjects: Project<AstFile>[],
  ) {
    if (fs.existsSync(path.join(stageProject.getAbsolutePath(), "costumes"))) {
      const stageCostumeManager = this.petals.getTargets().getStage().getCostumes();

      fs.readdirSync(path.join(stageProject.getAbsolutePath(), "costumes")).forEach(v => {
        const [...segments] = v.split(".");
        const extension = segments.pop();
        const name = segments.join(".");

        if (extension !== "png" && extension !== "svg") {
          throw new Error("Unsupported costume format: " + extension);
        }

        stageCostumeManager.addCostume(new Costume(name, extension, fs.readFileSync(path.join(stageProject.getAbsolutePath(), "costumes", v)), extension === "svg" ? Vector2.zero() : undefined));
      });
    }

    if (fs.existsSync(path.join(stageProject.getAbsolutePath(), "sounds"))) {
      const stageSoundManager = this.petals.getTargets().getStage().getSounds();

      fs.readdirSync(path.join(stageProject.getAbsolutePath(), "sounds")).forEach(v => {
        const [...segments] = v.split(".");
        const extension = segments.pop();
        const name = segments.join(".");

        if (extension !== "wav" && extension !== "mp3") {
          throw new Error("Unsupported sound format: " + extension);
        }

        stageSoundManager.addSound(new Sound(name, extension, fs.readFileSync(path.join(stageProject.getAbsolutePath(), "sounds", v))));
      });
    }

    const mainThread = this.petals.getTargets().getStage().getBlocks().createBlock(Blocks.Events.WhenFlagClicked);
    const context = new Context(this.petals.getTargets().getStage(), mainThread);

    const entryPoint = stageProject.getContents()[0];

    context.enterFile(entryPoint.path)

    let estore: ThornError | undefined;

    try {
      const translated = translateNodeListIntoBlock(entryPoint.contents, this.petals.getTargets().getStage(), context).getHead();
      mainThread.append(translated);
    } catch (e) {
      if (e instanceof ThornError) {
        estore = e;
      } else {
        throw e;
      }
    }

    stageProject.addFileErrors(context.exitFile(), estore ? [ estore, ...context.getTransformErrors() ] : context.getTransformErrors());

    spriteProjects.forEach(project => {
      const sprite = this.petals.getTargets().createSprite(project.getManifest().name);

      if (fs.existsSync(path.join(project.getAbsolutePath(), "costumes"))) {
        const costumeManager = sprite.getCostumes();

        fs.readdirSync(path.join(project.getAbsolutePath(), "costumes")).forEach(v => {
          const [...segments] = v.split(".");
          const extension = segments.pop();
          const name = segments.join(".");

          if (extension !== "png" && extension !== "svg") {
            throw new Error("Unsupported costume format: " + extension);
          }

          costumeManager.addCostume(new Costume(name, extension, fs.readFileSync(path.join(project.getAbsolutePath(), "costumes", v)), extension === "svg" ? Vector2.zero() : undefined));
        });
      }

      if (fs.existsSync(path.join(project.getAbsolutePath(), "sounds"))) {
        const soundManager = sprite.getSounds();

        fs.readdirSync(path.join(project.getAbsolutePath(), "sounds")).forEach(v => {
          const [...segments] = v.split(".");
          const extension = segments.pop();
          const name = segments.join(".");

          if (extension !== "wav" && extension !== "mp3") {
            throw new Error("Unsupported sound format: " + extension);
          }

          soundManager.addSound(new Sound(name, extension, fs.readFileSync(path.join(project.getAbsolutePath(), "sounds", v))));
        });
      }

      const mainThread = sprite.getBlocks().createBlock(Blocks.Events.WhenFlagClicked);
      const context = new Context(sprite, mainThread, false);

      mainThread.append(translateNodeListIntoBlock(project.getContents()[0].contents, sprite, context).getHead());
    });
  }

  static fromManifestPath(manifestAbsoluteFilePath: string): ScrProject {
    const stageProject = Project.fromManifestPath(manifestAbsoluteFilePath);
    let spriteProjects: Project<AstFile>[] = [];

    if (fs.existsSync(path.join(manifestAbsoluteFilePath, "..", "sprites"))) {
      spriteProjects = fs.readdirSync(path.join(manifestAbsoluteFilePath, "..", "sprites")).map(v => {
        return Project.fromManifestPath(path.join(manifestAbsoluteFilePath, "..", "sprites", v, "package.silo"));
      })
    }

    return new ScrProject(stageProject, spriteProjects);
  }
}
