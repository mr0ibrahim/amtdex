export interface TestimonialData {
  id?: number | string
  author: string
  role: string
  company: string
  content: string
  avatar?: string | null
  rating: number
  sort_order: number
  is_active: boolean
}

export interface FaqData {
  id?: number | string
  question: string
  answer: string
  category: string
  sort_order: number
  is_published: boolean
}

export interface TeamMemberData {
  id?: number | string
  name: string
  role: string
  bio?: string | null
  avatar?: string | null
  social_links?: {
    twitter?: string
    github?: string
    linkedin?: string
  }
  sort_order: number
  is_active: boolean
}

export interface ClientData {
  id?: number | string
  name: string
  logo: string
  url?: string | null
  sort_order: number
  is_active: boolean
}
