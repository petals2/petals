import { Project as SiteProjectType, OldProject as OldSiteProjectType } from "../../api/interfaces/project"
import { User } from "../user/user";
import { Sb3, SerializedProject } from "petals-stem";
import type { ProjectReference } from "petals-stem";
import { Client } from "..";
import { RemixStore } from "./remixStore";
import { CloudSession } from "./cloudSession";
import { ProjectCommentStore } from "./commentStore";
import JSZip from "jszip";
import { Project as LoadedProject } from "petals-stem";

export class SiteProject implements ProjectReference {
  protected id: number;
  protected title: string | undefined;
  protected description: string | undefined;
  protected instructions: string | undefined;
  protected visibility: string | undefined;
  protected public: boolean | undefined;
  protected comments_allowed: boolean | undefined;
  protected is_published: boolean | undefined;
  protected author: User | undefined;
  protected image: string | undefined;
  protected createdDate: Date | undefined;
  protected modifiedDate: Date | undefined;
  protected sharedDate: Date | null | undefined;
  protected views: number | undefined;
  protected loves: number | undefined;
  protected favorites: number | undefined;
  protected remixCount: number | undefined;
  protected remixParent: SiteProject | null | undefined;
  protected remixRoot: SiteProject | null | undefined;
  protected censored: boolean | undefined;
  protected censoredByAdmin: boolean | undefined;
  protected censoredByCommunity: boolean | undefined;
  protected deleted: boolean | undefined;
  protected reshareable: boolean | undefined;
  protected json: SerializedProject | undefined;
  protected zip: JSZip | undefined;
  // protected readonly session = new CloudSession(this.client, this)

  constructor(protected readonly client: Client, protected readonly project: number | (Partial<SiteProjectType> & { id: number }) | OldSiteProjectType, authorOverride: User | undefined = undefined) {
    if (typeof project === "number") {
      this.id = project;
    } else if ("pk" in project) {
      this.id = project.pk;
      this.title = project.fields.title;
      this.visibility = project.fields.visibility;
      this.is_published = project.fields.isPublished;
      if (authorOverride) {
        this.author = authorOverride;
      } else if ("username" in project.fields.creator) {
        this.author = new User(client, { username: project.fields.creator.username, id: project.fields.creator.pk, scratchteam: project.fields.creator.admin });
      }
      this.image = "https:" + project.fields.thumbnail_url;
      this.createdDate = new Date(project.fields.datetime_created + ".000Z");
      this.modifiedDate = new Date(project.fields.datetime_modified + ".000Z");
      if (project.fields.datetime_shared === null) {
        this.sharedDate = null;
      } else {
        this.sharedDate = new Date(project.fields.datetime_shared + ".000Z");
      }
      this.views = project.fields.view_count;
      this.loves = project.fields.love_count;
      this.favorites = project.fields.favorite_count;
      this.remixCount = project.fields.remixers_count;
    } else {
      this.id = project.id;
      if (authorOverride) {
        this.author = authorOverride;
      } else if (project.author && "username" in project.author) {
        this.author = new User(this.client, { username: project.author.username, id: project.author.id, scratchteam: project.author.scratchteam });
      } else if (project.author && (project.author as any).id === this.client.getId()) {
        this.author = this.client.user();
      }
      this.loadPartial(project);
    }
  }

  private loadPartial(project: Partial<SiteProjectType>) {
    this.title = project.title;
    this.description = project.description;
    this.instructions = project.instructions;
    this.visibility = project.visibility;
    this.public = project.public;
    this.comments_allowed = project.comments_allowed;
    this.is_published = project.is_published;
    this.image = project.image;
    this.createdDate = project.history && project.history.created ? new Date(project.history.created) : undefined;
    this.modifiedDate = project.history && project.history.modified ? new Date(project.history.modified) : undefined;
    this.sharedDate = project.history && project.history.shared ? new Date(project.history.shared) : undefined;
    if (project.stats) {
      this.views = project.stats.views;
      this.loves = project.stats.loves;
      this.favorites = project.stats.favorites;
      this.remixCount = project.stats.remixes;
    }
    if (project.remix) {
      this.remixParent = project.remix.parent == undefined ? project.remix.parent : new SiteProject(this.client, project.remix.parent);
      this.remixRoot = project.remix.root == undefined ? project.remix.root : new SiteProject(this.client, project.remix.root);
    }

    if (this.author !== undefined) return

    if (project.author && "username" in project.author) {
      this.author = new User(this.client, { username: project.author.username, id: project.author.id, scratchteam: project.author.scratchteam });
    } else if (project.author && (project.author as any).id === this.client.getId()) {
      this.author = this.client.user();
    }
  }

  async fetch(): Promise<void> {
    const project = await this.client.getRequestor().getProject(this.id);

    if ("code" in project) throw new Error(`Failed to fetch project ${this.id}, ${project.code}: ${project.message}`);

    this.loadPartial(project);
  }

  async load(): Promise<LoadedProject> {
    const contents = await this.client.getRequestor().getProjectContents(this.id);

    if (contents[0] == "P".charCodeAt(0) && contents[1] == "K".charCodeAt(0)) {
      this.zip = await JSZip.loadAsync(contents);

      const sb3 = await Sb3.fromReference(this.zip);

      this.json = await sb3.getJson();

      return await LoadedProject.fromReference(sb3);
    }

    this.json = JSON.parse(contents.toString());

    return await LoadedProject.fromReference(this);
  }

  async fetchVisibility(): Promise<void> {
    const visibility = await this.client.getRequestor().getProjectVisibility(this.id, await (await this.getAuthor()).getUsername());

    this.censored = visibility.censored;
    this.censoredByAdmin = visibility.censoredByAdmin;
    this.censoredByCommunity = visibility.censoredByCommunity;
    this.deleted = visibility.deleted;
    this.reshareable = visibility.reshareable;
  }

  async getId(): Promise<number> {
    return this.id;
  }

  async getTitle(): Promise<string> {
    if (this.title === undefined) await this.fetch();

    return this.title!;
  }

  async getDescription(): Promise<string> {
    if (this.description === undefined) await this.fetch();

    return this.description!;
  }

  async getInstructions(): Promise<string> {
    if (this.instructions === undefined) await this.fetch();

    return this.instructions!;
  }

  async getVisibility(): Promise<string> {
    if (this.visibility === undefined) await this.fetchVisibility();

    return this.visibility!;
  }

  async isPublic(): Promise<boolean> {
    if (this.public === undefined) await this.fetch();

    return this.public!;
  }

  async commentsAllowed(): Promise<boolean> {
    if (this.comments_allowed === undefined) await this.fetch();

    return this.comments_allowed!;
  }

  async isPublished(): Promise<boolean> {
    if (this.is_published === undefined) await this.fetch();

    return this.is_published!;
  }

  async getAuthor(): Promise<User> {
    if (this.author === undefined) await this.fetch();

    return this.author!;
  }

  async getThumbnail(): Promise<string> {
    if (this.image === undefined) await this.fetch();

    return this.image!;
  }

  async setThumbnail(image: Buffer): Promise<void> {
    const res = await this.client.getRequestor().setProjectThumbnail(this.id, image);

    if (res.status !== "ok") throw new Error(`Failed to set thumbnail: ${res.status}`);

    await this.fetch();
  }

  async getCreatedDate(): Promise<Date> {
    if (this.createdDate === undefined) await this.fetch();

    return this.createdDate!;
  }

  async getModifiedDate(): Promise<Date> {
    if (this.modifiedDate === undefined) await this.fetch();

    return this.modifiedDate!;
  }

  async getSharedDate(): Promise<Date | null> {
    if (this.sharedDate === undefined) await this.fetch();

    return this.sharedDate!;
  }

  async getViews(): Promise<number> {
    if (this.views === undefined) await this.fetch();

    return this.views!;
  }

  async getLoves(): Promise<number> {
    if (this.loves === undefined) await this.fetch();

    return this.loves!;
  }

  async getFavorites(): Promise<number> {
    if (this.favorites === undefined) await this.fetch();

    return this.favorites!;
  }

  async getJson(): Promise<SerializedProject> {
    if (this.json) return this.json;

    const response = await this.client.getRequestor().getProjectContents(await this.getId());

    if (response[0] == "P".charCodeAt(0) && response[1] == "K".charCodeAt(0))
      return await this.loadZip(response);

    return this.json = JSON.parse(response.toString());
  }

  private async loadZip(response: Buffer): Promise<SerializedProject> {
    this.zip = new JSZip();

    await this.zip.loadAsync(response);

    const project = this.zip.file("project.json");

    if (!project) throw new Error("No project.json file found in zip");

    return this.json = JSON.parse(await project.async("string"));
  }

  async isCensored(): Promise<boolean> {
    if (this.censored === undefined) await this.fetchVisibility();

    return this.censored!;
  }

  async isCensoredByAdmin(): Promise<boolean> {
    if (this.censoredByAdmin === undefined) await this.fetchVisibility();

    return this.censoredByAdmin!;
  }

  async isCensoredByCommunity(): Promise<boolean> {
    if (this.censoredByCommunity === undefined) await this.fetchVisibility();

    return this.censoredByCommunity!;
  }

  async isDeleted(): Promise<boolean> {
    if (this.deleted === undefined) await this.fetchVisibility();

    return this.deleted!;
  }

  async isReshareable(): Promise<boolean> {
    if (this.reshareable === undefined) await this.fetchVisibility();

    return this.reshareable!;
  }

  async getAsset(fileName: string): Promise<Buffer | undefined> {
    if (!this.zip)
      return this.client.getRequestor().getProjectFile(fileName);

    return await this.zip.file(fileName)?.async("nodebuffer");
  }

  remixes(): RemixStore { return new RemixStore(this.client, this) }
  createCloudSession(): CloudSession { return new CloudSession(this.client, this) }
  comments(): ProjectCommentStore { return new ProjectCommentStore(this.client, this) }
}
