import { Client } from "..";
import {
  Message as MessageType,
  UserJoinMessage as UserJoinMessageType,
  AddCommentMessage as AddCommentMessageType,
  FavoriteProjectMessage as FavoriteProjectMessageType,
  LoveProjectMessage as LoveProjectMessageType,
  CuratorInviteMessage as CuratorInviteMessageType,
  FollowUserMessage as FollowUserMessageType,
  AddCommentMessageType as AddCommentMessageTypeType,
} from "../../api/interfaces/message";
import { SiteProject } from "../project";
import { User } from "../user";

export abstract class Message {
  static fromJSON(client: Client, json: MessageType): Message {
    switch (json.type) {
      case "addcomment": return AddCommentMessage.fromJSON(client, json);
      case "loveproject": return new LoveProjectMessage(client, json);
      case "favoriteproject": return new FavoriteProjectMessage(client, json);
      case "curatorinvite": return new CuratorInviteMessage(client, json);
      case "followuser": return new FollowUserMessage(client, json);
      case "userjoin": return new UserJoinMessage(client, json);
      default: throw new Error(`Unknown message type: ${(json as any).type}`);
    }
  }

  constructor(protected readonly client: Client, protected readonly id: number, protected readonly creationTime: Date) {}

  getId(): number { return this.id }
  getCreationTime(): Date { return this.creationTime }

  isUserJoin(): this is UserJoinMessage { return false }
  isAddComment(): this is AddCommentMessage { return false }
  isAddProjectComment(): this is AddProjectCommentMessage { return false }
  isAddProfileComment(): this is AddProfileCommentMessage { return false }
  isAddStudioComment(): this is AddStudioCommentMessage { return false }
  isLoveProject(): this is LoveProjectMessage { return false }
  isFavoriteProject(): this is FavoriteProjectMessage { return false }
  isCuratorInvite(): this is CuratorInviteMessage { return false }
  isFollowUser(): this is FollowUserMessage { return false }
}

export class UserJoinMessage extends Message {
  constructor(client: Client, protected readonly message: UserJoinMessageType) {
    super(client, message.id, new Date(message.datetime_created));
  }

  isUserJoin(): this is UserJoinMessage { return true }

  getUser(): User { return new User(this.client, { username: this.message.actor_username, id: this.message.actor_id }) }
}

export abstract class AddCommentMessage extends Message {
  static fromJSON(client: Client, json: AddCommentMessageType): Message {

    switch(json.comment_type) {
      case AddCommentMessageTypeType.Project: return new AddProjectCommentMessage(client, json);
      case AddCommentMessageTypeType.Profile: return new AddProfileCommentMessage(client, json);
      case AddCommentMessageTypeType.Studio: return new AddStudioCommentMessage(client, json);
      default: throw new Error(`Unknown comment type: ${(json as any).comment_type}`);
    }
  }

  constructor(client: Client, protected readonly message: AddCommentMessageType) {
    super(client, message.id, new Date(message.datetime_created));
  }

  isAddComment(): this is AddCommentMessage { return true }

  getCommentId(): number { return this.message.comment_id }
  getCommentFragment(): string { return this.message.comment_fragment }
  //TODO: getComment()
  getCommenter(): User { return new User(this.client, { username: this.message.actor_username, id: this.message.actor_id }) }
}

export class AddProjectCommentMessage extends AddCommentMessage {
  constructor(client: Client, message: AddCommentMessageType) {
    super(client, message);
  }

  isAddProjectComment(): this is AddProjectCommentMessage { return true }

  getProject(): SiteProject { return new SiteProject(this.client, { id: this.message.comment_obj_id, title: this.message.comment_obj_title }) }
}

export class AddProfileCommentMessage extends AddCommentMessage {
  constructor(client: Client, message: AddCommentMessageType) {
    super(client, message);
  }

  isAddProfileComment(): this is AddProfileCommentMessage { return true }

  getProfile(): User { return new User(this.client, { username: this.message.comment_obj_title, id: this.message.comment_obj_id }) }
}

export class AddStudioCommentMessage extends AddCommentMessage {
  constructor(client: Client, message: AddCommentMessageType) {
    super(client, message);
  }

  isAddStudioComment(): this is AddStudioCommentMessage { return true }

  getStudioId(): number { return this.message.comment_obj_id }
  getStudioTitle(): string { return this.message.comment_obj_title }
  //TODO: getStudio()
}

export class LoveProjectMessage extends Message {
  constructor(client: Client, protected readonly message: LoveProjectMessageType) {
    super(client, message.id, new Date(message.datetime_created));
  }

  isLoveProject(): this is LoveProjectMessage { return true }

  getProject(): SiteProject { return new SiteProject(this.client, { id: parseInt(this.message.project_id), title: this.message.title }) }

  getActor(): User { return new User(this.client, { username: this.message.actor_username, id: this.message.actor_id }) }
}

export class FavoriteProjectMessage extends Message {
  constructor(client: Client, protected readonly message: FavoriteProjectMessageType) {
    super(client, message.id, new Date(message.datetime_created));
  }

  isFavoriteProject(): this is FavoriteProjectMessage { return true }

  getProject(): SiteProject { return new SiteProject(this.client, { id: parseInt(this.message.project_id), title: this.message.project_title }) }

  getFavoriter(): User { return new User(this.client, { username: this.message.actor_username, id: this.message.actor_id }) }
}

export class CuratorInviteMessage extends Message {
  constructor(client: Client, protected readonly message: CuratorInviteMessageType) {
    super(client, message.id, new Date(message.datetime_created));
  }

  isCuratorInvite(): this is CuratorInviteMessage { return true }

  getInviter(): User { return new User(this.client, { username: this.message.actor_username, id: this.message.actor_id }) }

  getStudioId(): number { return this.message.gallery_id }
  getStudioTitle(): string { return this.message.title }
  //TODO: getStudio()
}

export class FollowUserMessage extends Message {
  constructor(client: Client, protected readonly message: FollowUserMessageType) {
    super(client, message.id, new Date(message.datetime_created));
  }

  isFollowUser(): this is FollowUserMessage { return true }

  getFollower(): User { return new User(this.client, { username: this.message.actor_username, id: this.message.actor_id }) }
  getFollowed(): User { return new User(this.client, { username: this.message.followed_user_username, id: this.message.followed_user_id }) }
}
