import type { Comment as CommentType } from "../../../api/interfaces/comment";
import type { Client } from "../..";
import { User } from "../../user";
import { SiteProject } from "..";
import { ProjectCommentReplyStore } from "./replyStore";

export class ProjectComment {
  constructor(protected readonly client: Client, protected readonly project: SiteProject, protected readonly comment: CommentType, protected parent?: ProjectComment) {}

  getAuthor(): User {
    return new User(this.client, { username: this.comment.author.username, id: this.comment.author.id, scratchteam: this.comment.author.scratchteam });
  }

  getProject(): SiteProject { return this.project }

  getContent(): string {
    return this.comment.content;
  }

  getId(): number {
    return this.comment.id;
  }

  getCreatedTime(): Date {
    return new Date(this.comment.datetime_created)
  }

  getModifiedTime(): Date | undefined {
    if (this.comment.datetime_modified == undefined) return undefined;

    return new Date(this.comment.datetime_modified)
  }

  getVisibility(): string {
    return this.comment.visibility;
  }

  async getParent(): Promise<ProjectComment | undefined> {
    if (this.parent) return this.parent;

    if (this.comment.parent_id == undefined) return undefined;

    return this.parent = new ProjectComment(this.client, this.project, await this.client.getRequestor().getProjectComment(await this.project.getId(), await (await this.project.getAuthor()).getUsername(), this.comment.parent_id.toString()))
  }

  replies(): ProjectCommentReplyStore { return new ProjectCommentReplyStore(this.client, this.project, this) }
}
