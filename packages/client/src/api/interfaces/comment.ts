export interface Comment {
  author: {
    id: number,
    image: string,
    scratchteam: boolean,
    username: string,
  },
  commentee_id: number,
  content: string,
  datetime_created: string,
  datetime_modified: string,
  id: number,
  parent_id: number,
  reply_count: number,
  visibility: string,
}
