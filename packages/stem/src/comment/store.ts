import { Comment, SerializedComment } from "./comment"
import { Vector2 } from "../types/vector2";
import { Project, Sb3 } from "..";

export type SerializedCommentStore = Record<string, SerializedComment>;

export class CommentStore {
  private _store: Map<string, Comment> = new Map();

  static fromSb3(project: Project, sb3: Sb3, json: SerializedCommentStore) {
    const commentStore = new CommentStore;
    commentStore.deserialize(project, sb3, json);
    return commentStore;
  }

  findCommentById(id: string): Comment | undefined {
    return this._store.get(id);
  }

  getCommentById(id: string): Comment {
    const result = this.findCommentById(id);

    if (result === undefined)
      throw new Error("Failed to find comment by id: " + id);

    return result;
  }

  createComment(position: Vector2, text: string): Comment {
    const comment = new Comment(position, text);
    this._store.set(comment.getId(), comment);
    return comment;
  }

  removeComment(comment: Comment): void {
    this.removeCommentById(comment.getId());
  }

  removeCommentById(id: string): void {
    if (!this._store.has(id))
      throw new Error("Failed to find comment by id: " + id);

    this._store.delete(id);
  }

  protected deserialize(project: Project, sb3: Sb3, json: SerializedCommentStore) {
    const entries = Object.entries(json);
    for (const [ commentId, commentJson ] of entries) {
      this._store.set(commentId, Comment.fromSb3(project, sb3, commentJson));
    }
  }

  serialize(): SerializedCommentStore {
    const result: SerializedCommentStore = {};

    for (const comment of this._store.values()) {
      result[comment.getId()] = comment.serialize();
    }

    return result;
  }
}
