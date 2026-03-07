import { Content } from "@tiptap/react"

export interface User {
  id: string
  name: string
  avatar?: string
}

export interface Comment {
  id: string
  content: Content // TipTap JSON format
  author: User
  timestamp: Date
  replyTo?: string // ID of the comment being replied to
}