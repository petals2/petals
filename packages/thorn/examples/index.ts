import { ScrProject } from "../src/types/scratchProject";
import fs from "fs";
import path from "path";
import { TextRenderer } from "petals-render/dist/renderers/text";

const project = ScrProject.fromManifestPath(path.resolve(__dirname, "package.silo"));

// console.log(util.inspect(project.petals.serialize().targets[0].blocks, false, Infinity, true));

const stage = project.petals.getTargets().getStage();

project.petals.toSb3().then(sb3 => {
  fs.writeFileSync(path.resolve(__dirname, "out.sb3"), sb3);
  
  for (let head of stage.getBlocks().getAllBlockHeads()) {
    const renderer = new TextRenderer("English")
  
    console.log(renderer.renderStack(head, false));
  }

  console.log(path.resolve(__dirname, "out.sb3"));
})

