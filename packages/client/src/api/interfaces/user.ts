export interface User {
  id: number,
  username: string,
  scratchteam: boolean,
  history: {
    joined: string,
  },
  profile: {
    id: number,
    images: Record<`${number}x${number}`, string>,
    status: string,
    bio: string,
    country: string,
  }
}
