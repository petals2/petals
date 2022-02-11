export interface Studio {
  id: number,
  title: string,
  host: number,
  description: string,
  visiblity: string,
  public: boolean,
  open_to_all: boolean,
  comments_allowed: boolean,
  image: string,
  history: {
    created: string,
    modified: string,
  },
  stats: {
    comments: number,
    followers: number,
    managers: number,
    projects: number,
  }
}

export interface OldStudio {
  pk: number,
  model: "galleries.gallery",
  fields: {
    commenters_count: number,
    curators_count: number,
    datetime_created: string,
    datetime_modified: string,
    owner: {
      admin: boolean,
      pk: number,
      thumbnail_url: string,
      username: string,
    },
    projectors_count: number,
    thumbnail_url: string,
    title: string,
  }
}
