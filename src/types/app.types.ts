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