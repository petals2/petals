export interface UserJoinMessage {
  type: "userjoin",
  id: number,
  datetime_created: string,
  actor_username: string,
  actor_id: number,
}

export enum AddCommentMessageType {
  Project,
  Profile,
  Studio,
}

export interface AddCommentMessage {
  type: "addcomment",
  id: number,
  datetime_created: string,
  commentee_username: string,
  comment_type: AddCommentMessageType,
  comment_obj_title: string,
  comment_obj_id: number,
  comment_id: number,
  comment_fragment: string,
  actor_username: string,
  actor_id: number,
}

export interface LoveProjectMessage {
  type: "loveproject",
  id: number,
  datetime_created: string,
  title: string,
  project_id: string,
  actor_username: string,
  actor_id: number,
}

export interface FavoriteProjectMessage {
  type: "favoriteproject",
  id: number,
  datetime_created: string,
  project_title: string,
  project_id: string,
  actor_username: string,
  actor_id: number,
}

export interface CuratorInviteMessage {
  type: "curatorinvite",
  id: number,
  datetime_created: string,
  actor_username: string,
  actor_id: number,
  gallery_id: number,
  title: string,
}

export interface FollowUserMessage {
  type: "followuser",
  id: number,
  datetime_created: string,
  actor_username: string,
  actor_id: number,
  followed_user_id: number,
  followed_user_username: string,
}

export type Message = UserJoinMessage | AddCommentMessage | LoveProjectMessage | FavoriteProjectMessage | CuratorInviteMessage | FollowUserMessage;
