export interface Project {
  id: number;
  title: string;
  description: string;
  instructions: string;
  visibility: string;
  public: boolean;
  comments_allowed: boolean;
  is_published: boolean;
  author: {
    id: number;
    username: string;
    scratchteam: boolean;
    history: {
      // UNRELIABLE!! Seems to return 1900-01-01T00:00:00Z for some reason
      joined: string;
    },
    profile: {
      id: null,
      images: Record<`${number}x${number}`, string>,
    }
  },
  image: string,
  images: Record<`${number}x${number}`, string>,
  history: {
    created: string,
    modified: string,
    shared: string,
  },
  stats: {
    views: number,
    loves: number,
    favorites: number,
    remixes: number,
  },
  remix: {
    parent: null | number,
    root: null | number,
  }
}

export interface OldProject {
  pk: number,
  model: "projects.project",
  fields: {
    commenters_count: number,
    creator: {
      admin: boolean,
      pk: number,
      thumbnail_url: string,
      username: string,
    },
    datetime_created: string,
    datetime_modified: string,
    datetime_shared: string | null,
    favorite_count: number,
    isPublished: boolean,
    love_count: number,
    remixers_count: number,
    thumbnail: string,
    thumbnail_url: string,
    title: string,
    uncached_thumbnail_url: string,
    view_count: number,
    visibility: string,
  }
}
