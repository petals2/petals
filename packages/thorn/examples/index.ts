import { ScrProject } from "../src/types/scratchProject";
import fs from "fs";
import path from "path";

const project = ScrProject.fromManifestPath(path.resolve(__dirname, "examples\\package.silo"));

// console.log(util.inspect(project.petals.serialize().targets[0].blocks, false, Infinity, true));

project.petals.toSb3().then(sb3 => {
    fs.writeFileSync("out.sb3", sb3)
});
