export type BlogPostStatus = "draft" | "published" | "scheduled" | "archived"

export interface BlogCategory {
  id: number
  parent_id?: number | null
  name: string
  slug: string
  description?: string | null
  image?: string | null
  sort_order: number
  is_visible: boolean
  meta_title?: string | null
  meta_description?: string | null
  canonical_url?: string | null
  noindex?: boolean
  posts_count?: number
  published_posts_count?: number
  children?: BlogCategory[]
  created_at?: string
  updated_at?: string
}

export interface BlogTag {
  id: number
  name: string
  slug: string
  description?: string | null
  meta_title?: string | null
  meta_description?: string | null
  noindex?: boolean
  posts_count?: number
  published_posts_count?: number
}

export interface BlogComment {
  id: number
  post_id: number
  parent_id?: number | null
  author_name: string
  author_email: string
  author_url?: string | null
  content: string
  status: "pending" | "approved" | "rejected" | "spam"
  created_at: string
  approved_replies?: BlogComment[]
  post?: {
    id: number
    title: string
    slug: string
  }
}

export interface BlogRevision {
  id: number
  post_id: number
  user_id?: number | null
  title: string
  summary?: string | null
  content: string
  created_at: string
  user?: {
    id: number
    name: string
  }
}

export interface BlogFaqItem {
  question: string
  answer: string
}

export interface BlogPost {
  id: number
  author_id: number
  category_id?: number | null
  title: string
  slug: string
  summary?: string | null
  content: string
  cover_image?: string | null
  cover_image_alt?: string | null
  status: BlogPostStatus
  published_at?: string | null
  reading_time_minutes: number
  reading_time?: number
  views_count: number
  is_featured: boolean
  allow_comments: boolean
  focus_keyword?: string | null
  meta_title?: string | null
  meta_description?: string | null
  canonical_url?: string | null
  robots_index: boolean
  robots_follow: boolean
  noindex?: boolean
  og_title?: string | null
  og_description?: string | null
  og_image?: string | null
  og_type: string
  twitter_card: string
  twitter_title?: string | null
  twitter_description?: string | null
  twitter_image?: string | null
  schema_type: string
  faq_schema?: BlogFaqItem[] | null
  created_at?: string
  updated_at?: string
  author?: {
    id: number
    name: string
    avatar?: string | null
    bio?: string | null
    social_links?: Record<string, string> | null
  }
  category?: BlogCategory | null
  tags?: BlogTag[]
  approved_comments?: BlogComment[]
  comments?: BlogComment[]
  comments_count?: number
  revisions?: BlogRevision[]
}

export interface BlogRedirect {
  id: number
  source_path: string
  target_path: string
  status_code: number
  hits_count: number
  hits?: number
  created_at: string
  updated_at: string
}

export interface BlogSettings {
  blog_title: string
  blog_description: string
  blog_subdomain: string
  posts_per_page: number
  default_og_image: string
  title_template: string
  desc_template: string
  robots_txt: string
  rss_enabled: boolean
  comments_enabled: boolean
  comments_require_approval: boolean
  comments_auto_approve?: boolean
  google_analytics_id?: string
  gtm_id?: string
  google_search_console?: string
  bing_verification?: string
}

export interface BlogStats {
  total_posts: number
  published_posts: number
  total_views: number
  pending_comments: number
  categories_count?: number
  tags_count?: number
  top_posts: Array<{
    id: number
    title: string
    slug: string
    views_count: number
    published_at: string
  }>
  recent_comments: BlogComment[]
}
