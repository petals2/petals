import JSZip from "jszip";
import { SerializedTargetStore, TargetStore } from "../target/store";
import { ProjectMetadata } from "./types";

export type SerializedProject = {
  meta: ProjectMetadata;
  extensions: never[];
  monitors: never[];
  targets: SerializedTargetStore;
}

export class Project {
  private metadata: ProjectMetadata;
  private targetStore: TargetStore = new TargetStore();

  static fromJson(json: SerializedProject) {
    const project = new Project(
      json.meta.agent,
      json.meta.vm,
      json.meta.semver
    );
    project.deserialize(json);
    return project;
  }

  constructor(
    agent: string = "Petals",
    vm: string = "0.2.0-prerelease.20210131100123",
    semver: string = "3.0.0",
  ) {
    this.metadata = { agent, vm, semver }
  }

  getMetadata(): ProjectMetadata { return this.metadata }
  getTargets(): TargetStore { return this.targetStore }

  deserialize(json: SerializedProject) {
    this.metadata.agent = json.meta.agent;
    this.metadata.vm = json.meta.vm;
    this.metadata.semver = json.meta.semver;

    this.getTargets().deserialize(json);
  }

  serialize(): SerializedProject {
    return {
      meta: this.metadata,
      extensions: [],
      monitors: [],
      targets: this.targetStore.serialize(),
    }
  }

  async toSb3(): Promise<Buffer> {
    const zip = new JSZip();

    zip.file("project.json", JSON.stringify(this.serialize()));

    for (const target of this.getTargets().getTargets()) {
      target.getAssets().forEach(asset => {
        zip.file(asset.getMd5Hash() + "." + asset.getDataFormat(), asset.getData());
      });
    }

    return zip.generateAsync({ type: "nodebuffer" });
  }
}
