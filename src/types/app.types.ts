export type ProfileProps = {
  id: string
  name: string
  avatar: string
  description: string
  email: string
  posts: any[]
  followedBy: any[]
  following: any[]
}

export type User = {
  name: string | null
  avatar: string | null
  id: string
} | null

export type Suggestions = {
  name: string | null
  avatar: string | null
  followedBy: User[]
  id: string
}[]

export type Post = {
  User: User
  id: string
  createdAt: Date
  likedUsers: User[]
  images: string[]
  comments: any
}

export type Pages = {
  feed: {
    User: {
      name: string | null
      avatar: string | null
      id: string
    } | null
    id: string
    createdAt: Date
    comments: {
      User: {
        name: string | null
      } | null
      id: string
      body: string
      createdAt: Date
    }[]
    likedUsers: User[]
    images: string[]
  }[]
  nextCursor: string | undefined
}[]
